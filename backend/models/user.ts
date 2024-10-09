//backend/models/user.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  role: 'user' | 'supplier' | 'shop' | 'manager' | 'admin' | 'superadmin'; // Make sure these are the exact enum values
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {   
    type: String, 
    enum: ['user', 'supplier', 'shop', 'manager', 'admin', 'superadmin'], // Define valid enum values
    required: true ,
    default: 'user' // Default role
  }
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
