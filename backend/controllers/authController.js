import * as dbService from '../database/dbService.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res, next) => {
  const { name, phone, email, password } = req.body;

  // Simple robust validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required fields." });
  }

  try {
    const existingUser = await dbService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    const newUser = await dbService.createUser({ name, phone, email, password });
    res.status(201).json({
      message: "Registration successful.",
      user: newUser
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const user = await dbService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    await dbService.updateLastLogin(user.person_id);

    res.status(200).json({
      message: "Login successful.",
      user: {
        personId: user.person_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        lastLogin: new Date()
      }
    });
  } catch (error) {
    next(error);
  }
};

export const checkEmail = async (req, res, next) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email query parameter is required." });
  }

  try {
    const user = await dbService.findUserByEmail(email);
    res.status(200).json({
      available: !user
    });
  } catch (error) {
    next(error);
  }
};
