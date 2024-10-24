//frontend/src/components/Auth.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api'; // Assuming these API functions are available


const Auth = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  // Function to set token in local storage
  const setToken = (token: string) => {
    localStorage.setItem('token', token);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setErrorMessage(''); // Reset error message before submission
    try {
      if (isRegistering) {
        await register(username, password, role);
        setErrorMessage('User registered successfully');
      } else {
        //handle login
        const response = await login(username, password);
        console.log('Login response:', response);
        const token = response.token;

        setToken(token);
        localStorage.setItem('token', token);
        
        setErrorMessage('Logged in successfully');
        navigate('/products'); // Redirect to dashboard or any other route after login
      }
    } catch (error: any) {
      console.error('Error during authentication:', error); // Log the error for debugging
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || 'Error during authentication');
      } else {
        setErrorMessage('Network error');
      }
    }
    
  };
  
  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full mx-4 sm:mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-globe text-purple-500 text-3xl"></i>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">
            {isRegistering ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-500">
            {isRegistering ? 'Fill in your details to register' : 'Please enter your details to sign in'}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 text-center text-red-500">{errorMessage}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-lg pr-10"
                required
              />
              <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                <i className="fas fa-eye-slash"></i>
              </button>
            </div>
          </div>

          {isRegistering && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg"
              >
                <option value="user">User</option>
                <option value="supplier">Supplier</option>
                <option value="shop">Shop</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-purple-500 text-white p-3 rounded-lg font-semibold"
          >
            {isRegistering ? 'Register' : 'Sign in'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-500">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-purple-500"
            >
              {isRegistering ? 'Sign in' : 'Create account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
