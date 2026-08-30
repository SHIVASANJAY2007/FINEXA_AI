import { pool } from './db.js';
import bcrypt from 'bcryptjs';

// Sequence Generator for person_id (e.g. ZYV0001, ZYV0002)
export const generatePersonId = async () => {
  const result = await pool.query(
    "SELECT person_id FROM personal_details WHERE person_id LIKE 'ZYV%' ORDER BY person_id DESC LIMIT 1"
  );
  if (result.rows.length === 0) {
    return 'ZYV0001';
  }
  const lastId = result.rows[0].person_id;
  const numPart = lastId.replace('ZYV', '');
  const nextNum = parseInt(numPart, 10) + 1;
  return `ZYV${String(nextNum).padStart(4, '0')}`;
};

// ==========================================
// USER SERVICES
// ==========================================

export const createUser = async ({ name, phone, email, password }) => {
  const personId = await generatePersonId();
  const passwordHash = await bcrypt.hash(password, 10);
  
  const query = `
    INSERT INTO personal_details (person_id, name, phone, email, password_hash)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING person_id, name, phone, email, created_at
  `;
  const result = await pool.query(query, [personId, name, phone, email, passwordHash]);
  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const query = `SELECT * FROM personal_details WHERE email = $1`;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

export const findUserById = async (personId) => {
  const query = `SELECT person_id, name, phone, email, created_at, last_login FROM personal_details WHERE person_id = $1`;
  const result = await pool.query(query, [personId]);
  return result.rows[0];
};

export const updateLastLogin = async (personId) => {
  const query = `
    UPDATE personal_details
    SET last_login = CURRENT_TIMESTAMP
    WHERE person_id = $1
    RETURNING last_login
  `;
  const result = await pool.query(query, [personId]);
  return result.rows[0];
};

// ==========================================
// TRAVEL PLAN CRUD SERVICES
// ==========================================

export const createTravelPlan = async ({
  person_id,
  source,
  destination,
  date_of_going,
  date_of_returning,
  activities,
  mode_of_transport,
  hotel_required,
  hotel_name,
  car_rent
}) => {
  const query = `
    INSERT INTO travel_details (
      person_id, source, destination, date_of_going, date_of_returning,
      activities, mode_of_transport, hotel_required, hotel_name, car_rent
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `;
  const values = [
    person_id,
    source,
    destination,
    date_of_going || null,
    date_of_returning || null,
    activities || null,
    mode_of_transport || null,
    hotel_required || false,
    hotel_name || null,
    car_rent || false
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getTravelPlansByUser = async (personId) => {
  const query = `SELECT * FROM travel_details WHERE person_id = $1 ORDER BY travel_id DESC`;
  const result = await pool.query(query, [personId]);
  return result.rows;
};

export const getTravelPlanById = async (travelId) => {
  const query = `SELECT * FROM travel_details WHERE travel_id = $1`;
  const result = await pool.query(query, [travelId]);
  return result.rows[0];
};

export const updateTravelPlan = async (travelId, {
  source,
  destination,
  date_of_going,
  date_of_returning,
  activities,
  mode_of_transport,
  hotel_required,
  hotel_name,
  car_rent
}) => {
  const query = `
    UPDATE travel_details
    SET source = COALESCE($1, source),
        destination = COALESCE($2, destination),
        date_of_going = $3,
        date_of_returning = $4,
        activities = $5,
        mode_of_transport = $6,
        hotel_required = $7,
        hotel_name = $8,
        car_rent = $9
    WHERE travel_id = $10
    RETURNING *
  `;
  const values = [
    source,
    destination,
    date_of_going || null,
    date_of_returning || null,
    activities || null,
    mode_of_transport || null,
    hotel_required || false,
    hotel_name || null,
    car_rent || false,
    travelId
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteTravelPlan = async (travelId) => {
  const query = `DELETE FROM travel_details WHERE travel_id = $1 RETURNING *`;
  const result = await pool.query(query, [travelId]);
  return result.rowCount > 0;
};

// ==========================================
// CHAT HISTORY SERVICES
// ==========================================

export const saveMessage = async ({ person_id, session_id, role, message }) => {
  const query = `
    INSERT INTO chat_history (person_id, session_id, role, message)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const result = await pool.query(query, [person_id || null, session_id, role, message]);
  return result.rows[0];
};

export const getChatHistory = async (sessionId) => {
  const query = `
    SELECT chat_id, person_id, session_id, role, message, created_at
    FROM chat_history
    WHERE session_id = $1
    ORDER BY chat_id ASC
  `;
  const result = await pool.query(query, [sessionId]);
  return result.rows;
};

export const getRecentChatHistory = async (personId, limit = 50) => {
  const query = `
    SELECT chat_id, person_id, session_id, role, message, created_at
    FROM chat_history
    WHERE person_id = $1
    ORDER BY chat_id DESC
    LIMIT $2
  `;
  const result = await pool.query(query, [personId, limit]);
  // Reverse to make it ascending chronological order
  return result.rows.reverse();
};
