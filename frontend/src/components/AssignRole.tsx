//frontend/src/components/AssignRole.tsx
import React, { useState } from 'react';
import { assignRole } from '../api';  // API function to call the backend for assigning roles

const AssignRole = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('user');  // Default role
  const [loading, setLoading] = useState(false); // Loading state
  const [errorMessage, setErrorMessage] = useState('');

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the request is initiated
    setErrorMessage(''); // Reset error message
    try {
      await assignRole(username, role);
      setUsername('');  // Clear the form fields after success
      setRole('user');
      alert(`Role ${role} assigned to ${username}`);
    } catch (error) {
      alert('Failed to assign role');
    }finally {
      setLoading(false);  // Set loading to false once the request completes
    }
  };

  return (
    <div>
      <h2>Assign Role</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleAssignRole}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="supplier">Supplier</option>
          <option value="shop">Shop</option>
          <option value="manager">Manager</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Assigning...' : 'Assign Role'}
        </button>
      </form>
    </div>
  );
};

export default AssignRole;
