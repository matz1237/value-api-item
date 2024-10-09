//frontend/src/components/Register.tsx
import React, { useState } from 'react';
import { register } from '../api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(username, password, role);
      alert('User registered successfully');
    } catch (error: any) {
      console.error('Registration error:', error.response?.data || error.message);
      alert('Error registering user');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role (admin/editor)" required />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
