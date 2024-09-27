import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import User from '../models/user';

// Define the local authentication strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Use async/await with Mongoose
      const user = await User.findOne({ username }).lean();

      if (!user) {
        return done(new Error('Username not found'), false);
      }

      // Compare the password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return done(new Error('Incorrect password'), false);
      }

      return done(null, user as any);
    } catch (err) {
      return done(new Error('An error occurred while authenticating'), false);
    }
  })
);

// Serialize user into the session
passport.serializeUser((user: any, done) => {
  if (!user) {
    return done(new Error('User not found'), false);
  }
  done(null, user._id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).lean();
    if (!user) {
      return done(new Error('User not found'), false);
    }
    done(null, user as any);
  } catch (err) {
    return done(new Error('An error occurred while deserializing user'), false);
  }
});

export default passport;