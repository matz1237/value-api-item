
// src/types.d.ts (or wherever you prefer)
import { Document } from 'mongoose';

declare global {
  namespace Express {
    interface User extends Document {
      _id: string;
      username: string;
      role: string;  // Add 'role' field
    }
  }
}
