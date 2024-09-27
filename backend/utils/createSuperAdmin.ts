import User from '../models/user'; // Adjust path as necessary
import bcrypt from 'bcryptjs';

async function createSuperAdmin() {
  const username = 'superadmin';
  const password = 'supersecretpassword'; // Secure this properly in production

  const hashedPassword = await bcrypt.hash(password, 10);

  const superAdmin = new User({
    username,
    password: hashedPassword,
    role: 'superadmin'
  });

  try {
    await superAdmin.save();
    console.log('Super Admin created successfully');
  } catch (err) {
    console.error('Error creating Super Admin:', err);
  }
}

createSuperAdmin();
