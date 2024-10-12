//backend/auth/passport.ts
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import User,  { IUser }from '../models/user';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your_jwt_secret'
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await User.findById(payload.id).lean();
      if (user) {
        return done(null, user as IUser);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);



// Define the local authentication strategy
/*passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Use async/await with Mongoose
      const user = await User.findOne({ username }).lean();
      if (!user) {
        console.log('Error: Username not found');
        return done(null, false, { message: 'Incorrect username.' });
      }

      console.log('User found, checking password...');

      // Compare the password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      console.log(`Password matches: ${isMatch}`);
      if (!isMatch) {
        console.log('Error: Incorrect password');
        return done(null, false, { message: 'Incorrect password.' });
      }

      console.log('Password match successful, logging in...');
      return done(null, user as IUser );
    } catch (err) {
      console.error('Error during login process:', err);
      return done(err);
    }
  })
);

// Serialize user into the session
passport.serializeUser((user: Express.User, done) => {
  if (!user) {
    console.error('Error: User not found during serialization');
    return done(new Error('User not found'), false);
  }
  console.log('Serializing user:', (user as IUser)._id);
  done(null, (user as IUser)._id); 
});

// Deserialize user from the session
passport.deserializeUser(async (id : string, done) => {
  try {
    console.log('Deserializing user with ID:', id);
    const user = await User.findById(id).lean();
    if (!user) {
      console.error('Error: User not found during deserialization');
      return done(new Error('User not found'), false);
    }
    console.log('User deserialized:', user.username);
    done(null, user as IUser);
  } catch (err) {
    console.error('Error during user deserialization:', err);
    return done(new Error('An error occurred while deserializing user'), false);
  }
});
*/
export default passport;