import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function AuthDebug() {
  const { user } = useAuth();

  return (
    <div style={{ 
      position: 'fixed', 
      top: 10, 
      right: 10, 
      backgroundColor: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>Auth Debug</h4>
      {user ? (
        <>
          <p><strong>User:</strong> {user.email}</p>
          <p><strong>Name:</strong> {user.full_name}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>ID:</strong> {user.id}</p>
        </>
      ) : (
        <p>No user logged in</p>
      )}
    </div>
  );
}
