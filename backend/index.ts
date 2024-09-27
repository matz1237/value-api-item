import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from './auth/passport';
import session from 'express-session';
import authRouter from './routes/auth';
import productsRouter from './routes/products';

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3006', // URL of your frontend
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}));
// MongoDB connection
mongoose.connect(process.env.MONGODB_URI as string  )
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());

// Session configuration (provide a secret key)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret', // Ensure a secret is provided from .env or fallback
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);

app.listen(process.env.port, () => console.log(`Server listening on port 🚀 ${process.env.port}`))