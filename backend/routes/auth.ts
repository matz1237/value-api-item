import express, { Request, Response } from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import User from '../models/user';


const router = express.Router();

// Login route
router.post('/login', (req: Request, res: Response) => {
  passport.authenticate('local', (err: Error, user: Express.User, info: any) => {
    if (err) {
      console.error('Authentication Error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error('Login Error:', err);
        return res.status(500).json({ message: 'Error logging in' });
      }
      return res.status(200).json({ message: 'Logged in successfully' });
    });
  })(req, res);
});
// Logout route
router.get('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout Error:', err);
      return res.status(500).json({ message: 'Error logging out' });
    }
    return res.status(200).json({ message: 'Logged out successfully' });
  });
});

// Middleware to check if the user is a superadmin
const isSuperAdmin = (req: Request, res: Response, next: () => void) => {
  if (req.user?.role === 'superadmin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Only superadmins can assign roles.' });
};

// Route to assign a role to a user
router.put('/assign-role/:id', isSuperAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['user', 'supplier', 'shop', 'manager', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;
    await user.save();

    return res.json({ message: 'Role assigned successfully', user });
  } catch (error) {
    return res.status(500).json({ message: 'Error assigning role', error });
  }
});

export default router;