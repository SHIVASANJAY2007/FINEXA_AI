# BIZRA AI - Production Deployment Guide

This repository contains the **BIZRA AI** project organized as a clean, production-ready monorepo:
- **`frontend/`**: React + Vite single-page application (deployed to **Vercel**).
- **`backend/`**: Node.js + Express proxy server with PostgreSQL storage (deployed to **Render**).

---

## 1. Backend Deployment (Render)

Render is configured to deploy the Express backend directly from the `backend/` folder.

### Option A: Using the Render Blueprint (`render.yaml`)
1. Push this repository to your GitHub/GitLab account.
2. In the Render Dashboard, click **New** -> **Blueprint**.
3. Select this repository. Render will automatically parse the `render.yaml` file and configure the service:
   - **Service Type**: Web Service
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run start`
4. Fill in the required environment variables in the prompt and click **Deploy**.

### Option B: Manual Setup on Render
If deploying manually:
1. Create a new **Web Service** on Render and link it to this repository.
2. Configure the following settings:
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm run start`
3. Add the following **Environment Variables** in the service settings:
   - `PORT`: `5000` (or leave default, Render sets this automatically)
   - `DATABASE_URL`: Your PostgreSQL connection string (e.g. `postgresql://...`). *Note: On startup, the backend will verify connection and create all tables (`personal_details`, `travel_details`, `chat_history`). If the database is not configured/ignored, the server will log a connection warning but boot up successfully.*
   - `N8N_WEBHOOK_URL`: Your n8n workflow webhook POST URL.
   - `N8N_BASE_URL`: The origin URL of your n8n instance (e.g., `https://n8n.your-domain.com`).
   - `PEXELS_API_KEY`: Your Pexels search API key.

---

## 2. Frontend Deployment (Vercel)

Vercel is optimized to build and deploy the React frontend directly from the `frontend/` folder.

### Step-by-Step Setup
1. In the Vercel Dashboard, click **Add New** -> **Project**.
2. Select this repository.
3. Configure the Project Settings:
   - **Framework Preset**: `Vite` (Vercel detects this automatically)
   - **Root Directory**: `frontend` (Click edit and choose the `frontend` folder)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Add the following **Environment Variable**:
   - `VITE_API_BASE_URL`: Point this to the URL of your deployed Render backend (e.g. `https://BIZRA-ai-backend.onrender.com/api`).
5. Click **Deploy**. Vercel will build the assets and handle SPA routing seamlessly using the included `vercel.json` rewrites.
