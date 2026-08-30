import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

export const getMedia = async (req, res, next) => {
  const query = req.query.q || req.query.query;

  if (!query) {
    return res.status(400).json({ error: "Search query 'q' or 'query' is required." });
  }

  if (!PEXELS_API_KEY) {
    return res.status(500).json({ error: "Pexels API key is not configured on the server." });
  }

  const limit = parseInt(req.query.per_page, 10) || 12;

  try {
    const photoUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${limit}`;
    const videoUrl = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${limit}`;

    // Execute photo and video searches in parallel
    const [photoRes, videoRes] = await Promise.all([
      fetch(photoUrl, {
        headers: { 'Authorization': PEXELS_API_KEY }
      }),
      fetch(videoUrl, {
        headers: { 'Authorization': PEXELS_API_KEY }
      })
    ]);

    let photosData = { photos: [] };
    let videosData = { videos: [] };

    if (photoRes.ok) {
      photosData = await photoRes.json();
    } else {
      console.error(`Pexels Photo search failed with status ${photoRes.status}`);
    }

    if (videoRes.ok) {
      videosData = await videoRes.json();
    } else {
      console.error(`Pexels Video search failed with status ${videoRes.status}`);
    }

    // Clean and return structured data
    res.status(200).json({
      photos: photosData.photos || [],
      videos: videosData.videos || []
    });

  } catch (error) {
    next(error);
  }
};
