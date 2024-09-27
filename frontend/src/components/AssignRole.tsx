import React, { useState } from 'react';
import { assignRole } from '../api';  // API function to call the backend for assigning roles

const AssignRole = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('user');  // Default role

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await assignRole(username, role);
      alert(`Role ${role} assigned to ${username}`);
    } catch (error) {
      alert('Failed to assign role');
    }
  };

  return (
    <div>
      <h2>Assign Role</h2>
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
        <button type="submit">Assign Role</button>
      </form>
    </div>
  );
};

export default AssignRole;
