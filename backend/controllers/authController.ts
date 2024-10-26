// controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import { createJWT, verifyJWT } from '../utils/jwtUtils';
import { hashPassword, verifyPassword } from '../utils/passwordUtils';

export class AuthController {
  // Register new user
  static async register(req: Request, res: Response) {
    try {
      const { username, password, role } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create new user
      const user = new User({
        username,
        password: hashedPassword,
        role: role || 'user',
        passwordHistory: [{ password: hashedPassword }]
      });

      await user.save();

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error in registration', error });
    }
  }

  // Login user
  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check if account is locked
      if (user.accountLocked && user.lockUntil && user.lockUntil > new Date()) {
        return res.status(423).json({
          message: 'Account is locked. Please try again later',
          lockUntil: user.lockUntil
        });
      }

      // Verify password
      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        // Increment failed login attempts
        user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

        // Lock account if too many failed attempts
        if (user.failedLoginAttempts >= 5) {
          user.accountLocked = true;
          user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        }

        await user.save();
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Reset failed attempts on successful login
      user.failedLoginAttempts = 0;
      user.accountLocked = false;
      user.lockUntil = undefined;
      await user.save();

      // Create JWT token
      const token = createJWT(user);

      res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
    } catch (error) {
      res.status(500).json({ message: 'Error in login', error });
    }
  }}