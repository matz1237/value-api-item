  //backend/routes/auth.ts
  import express, { Request, Response,NextFunction  } from 'express';
  import jwt from 'jsonwebtoken';
  import passport from 'passport';
  import { assignRole } from '../controllers/roleController';
  import User, { IUser } from '../models/user';
  import bcrypt from 'bcryptjs';
  import { v4 as uuidv4 } from 'uuid';
  import rateLimit from 'express-rate-limit';
  import crypto from 'crypto';


  const router = express.Router();

  const JWT_SECRET = process.env.JWT_SECRET;
  if(!JWT_SECRET){
    throw new Error('JWT_SECRET must be defined in environment variables');
  }

  //Login Rate Limit
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts
    message: 'Too many login attempts, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
  });


  // Login route
  router.post('/login', loginLimiter, async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    try{
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(401).json({ message: 'Authentication failed: Incorrect username or password' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Authentication failed: Incorrect username or password' });
      }
      const token = jwt.sign(
        { 
          id: user._id, 
          username: user.username, 
          role: user.role 
        },
          JWT_SECRET,
        { 
          expiresIn: '1d',
          algorithm : 'HS256',
          jwtid : uuidv4(),
          audience : process.env.JWT_AUDIENCE,
          issuer : process.env.JWT_ISSUER
        
        }
      );
      return res.status(200).json({
        token,
        message: 'Logged in successfully',
        user: { 
          id: user._id, 
          username: user.username, 
          role: user.role
         }
      });
    }catch(err){
      console.error('Login Error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Logout route
  router.get('/logout', (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        console.error('Logout Error:', err);
        return res.status(500).json({ message: 'Error logging out', error: err.message });
      }
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });

  const validatePassword = (password: string): boolean => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  };


  // Registration route
  router.post('/register', async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!validatePassword(password)) {
        return res.status(400).json({
          message: 'Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters'
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const newUser = new User({
        username,
        password: hashedPassword,
        role: 'user' // Default role
      });

      await newUser.save();

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Registration Error:', error);
      res.status(500).json({ 
        message: 'Error registering user', 
        error: (error as Error).message
       });
    }
  });

  // Middleware to check if user is authenticated
  const isAuthenticated = passport.authenticate('jwt', { session: false });



  // Middleware to check if user is a superadmin
  const isSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && (req.user as IUser).role === 'superadmin') {
      return next();
    }
    res.status(403).json({ message: 'Access denied. Only superadmins can perform this action.' });
  };

  // Protected route
  router.get('/protected', isAuthenticated, (req: Request, res: Response) => {
    res.json({ message: 'Hello, authenticated user!', user: req.user });
  });

  // Superadmin-only route example
  router.get('/superadmin-only',isAuthenticated, isSuperAdmin, (req: Request, res: Response) => {
    res.json({ message: 'Hello, superadmin!', user: req.user });
  });

  // Route to assign a role to a user
  router.put('/assign-role/:id',isAuthenticated, isSuperAdmin, async (req: Request, res: Response) => {
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

      return res.json({
        message: 'Role assigned successfully', 
        user: { id: user._id, username: user.username, role: user.role } 
      });
    } catch (error) {
      console.error('Error assigning role:', error);
      return res.status(500).json({ message: 'Error assigning role', error: (error as Error).message });
    }
  });

  // Route to get all users (superadmin only)
  router.get('/users', isAuthenticated, isSuperAdmin, async (req: Request, res: Response) => {
    try {
      const users = await User.find({}, '-password'); // Exclude password field
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users', error: (error as Error).message });
    }
  });

  // Route to assign a role to a user (superadmin only)
  router.put('/assign-role',isAuthenticated, isSuperAdmin, assignRole);

  //forgot-password
  router.post('/forgot-password', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User  not found' });
      }
  
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
  
      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
      await user.save();
  
      // Send email with reset token
      // Implementation depends on your email service
      
      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      res.status(500).json({ message: 'Error in password reset process' });
    }
  });
  export default router;
