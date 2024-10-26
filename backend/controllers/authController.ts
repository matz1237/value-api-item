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
  }

  // Change password
  static async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user?.id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Verify current password
      const isValid = await verifyPassword(currentPassword, user.password);
      if (!isValid) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      // Check password history
      const passwordHistoryMatch = await Promise.all(
        user.passwordHistory.map(async (hist) => 
          await verifyPassword(newPassword, hist.password)
        )
      );

      if (passwordHistoryMatch.includes(true)) {
        return res.status(400).json({ 
          message: 'Password has been used recently. Choose a different password.' 
        });
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update password and history
      user.password = hashedPassword;
      user.passwordHistory.push({ password: hashedPassword });
      if (user.passwordHistory.length > 5) {
        user.passwordHistory.shift(); // Keep only last 5 passwords
      }

      user.passwordChangedAt = new Date();
      user.passwordExpiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

      await user.save();

      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error changing password', error });
    }
  }

  // Reset password request
  static async requestPasswordReset(req: Request, res: Response) {
    try {
      const { username } = req.body;
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

      await user.save();

      // TODO: Send email with reset token
      // In production, implement email sending logic here

      res.json({ message: 'Password reset instructions sent to email' });
    } catch (error) {
      res.status(500).json({ message: 'Error requesting password reset', error });
    }
  }
}