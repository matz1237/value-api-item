// backend/controllers/roleController.ts
import { Request, Response } from 'express';
import User from '../models/user';

export const assignRole = async (req: Request, res: Response) => {
  const { userId, newRole } = req.body;

  if (!['user', 'supplier', 'shop', 'manager', 'admin', 'superadmin'].includes(newRole)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the authenticated user is a superadmin
    const authenticatedUser = req.user as any;
    if (authenticatedUser.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only superadmins can assign roles' });
    }

    user.role = newRole;
    await user.save();

    return res.status(200).json({ 
      message: `Role ${newRole} assigned to user ${user.username}`,
      user: { id: user._id, username: user.username, role: user.role }
    });
  } catch (error) {
    console.error('Error assigning role:', error);
    return res.status(500).json({ message: 'Failed to assign role', error: (error as Error).message });
  }
};
