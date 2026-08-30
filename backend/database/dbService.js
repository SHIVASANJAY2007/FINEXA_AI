import bcrypt from 'bcryptjs';

// In-Memory Data Stores
const users = [];
const travelPlans = [];
const chatHistory = [];

// Sequence Generator for person_id (e.g. ZYV0001, ZYV0002)
export const generatePersonId = async () => {
  const nextNum = users.length + 1;
  return `ZYV${String(nextNum).padStart(4, '0')}`;
};

// ==========================================
// USER SERVICES
// ==========================================

export const createUser = async ({ name, phone, email, password }) => {
  const personId = await generatePersonId();
  const passwordHash = await bcrypt.hash(password, 10);
  
  const user = {
    person_id: personId,
    name,
    phone,
    email,
    password_hash: passwordHash,
    created_at: new Date()
  };
  users.push(user);
  return user;
};

export const findUserByEmail = async (email) => {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const findUserById = async (personId) => {
  return users.find(u => u.person_id === personId);
};

export const updateLastLogin = async (personId) => {
  const user = users.find(u => u.person_id === personId);
  if (user) {
    user.last_login = new Date();
    return { last_login: user.last_login };
  }
  return null;
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
  const travelId = travelPlans.length + 1;
  const plan = {
    travel_id: travelId,
    person_id,
    source,
    destination,
    date_of_going: date_of_going || null,
    date_of_returning: date_of_returning || null,
    activities: activities || null,
    mode_of_transport: mode_of_transport || null,
    hotel_required: hotel_required || false,
    hotel_name: hotel_name || null,
    car_rent: car_rent || false,
    created_at: new Date()
  };
  travelPlans.push(plan);
  return plan;
};

export const getTravelPlansByUser = async (personId) => {
  return travelPlans.filter(p => p.person_id === personId);
};

export const getTravelPlanById = async (travelId) => {
  return travelPlans.find(p => p.travel_id === Number(travelId));
};

export const updateTravelPlan = async (travelId, fields) => {
  const plan = travelPlans.find(p => p.travel_id === Number(travelId));
  if (plan) {
    Object.keys(fields).forEach(key => {
      if (fields[key] !== undefined) {
        plan[key] = fields[key];
      }
    });
    return plan;
  }
  return null;
};

export const deleteTravelPlan = async (travelId) => {
  const idx = travelPlans.findIndex(p => p.travel_id === Number(travelId));
  if (idx !== -1) {
    travelPlans.splice(idx, 1);
    return true;
  }
  return false;
};

// ==========================================
// CHAT HISTORY SERVICES
// ==========================================

export const saveMessage = async ({ person_id, session_id, role, message }) => {
  const chatId = chatHistory.length + 1;
  const msg = {
    chat_id: chatId,
    person_id: person_id || null,
    session_id,
    role,
    message,
    created_at: new Date()
  };
  chatHistory.push(msg);
  return msg;
};

export const getChatHistory = async (sessionId) => {
  return chatHistory.filter(h => h.session_id === sessionId);
};

export const getRecentChatHistory = async (personId, limit = 50) => {
  const history = chatHistory.filter(h => h.person_id === personId);
  return history.slice(-limit);
};
