//backend/models/user.ts
import mongoose, { Schema, Document,Types  } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  password: string;
  role: 'user' | 'supplier' | 'shop' | 'manager' | 'admin' | 'superadmin'; // Make sure these are the exact enum values
  passwordHistory: { password: string; createdAt: Date }[];
  passwordChangedAt: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  failedLoginAttempts: number; 
  accountLocked: boolean;
  lockUntil?: Date;
}

const UserSchema: Schema = new Schema({
  username: { 
    type: String,
    required: true,
    unique: true 
  },
  password: { 
    type: String,
    required: true 
  },
  role: {   
    type: String, 
    enum: ['user', 'supplier', 'shop', 'manager', 'admin', 'superadmin'], // Define valid enum values
    required: true ,
    default: 'user', // Default role
  },
  passwordHistory: [{
    password: { 
      type: String, 
      required: true 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  }],
  passwordChangedAt: { 
    type: Date 
  },
  passwordLastChanged: { 
    type: Date, 
    default: Date.now 
  },
  passwordExpiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 90 * 24 * 60 * 60 * 1000) // 90 days
  },
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  accountLocked: {
    type: Boolean,
    default: false
  },
  lockUntil: {
    type: Date
  },
  resetPasswordToken: { 
    type: String 
  },
  resetPasswordExpires: { 
    type: Date 
  }
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;