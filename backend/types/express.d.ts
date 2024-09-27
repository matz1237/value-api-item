import { IUser } from '../models/user'; // Assuming this is the path to your User model

declare global {
  namespace Express {
    interface User extends IUser {} // Extending the User interface with your IUser properties
  }
}