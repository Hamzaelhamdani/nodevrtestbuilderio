
import React from 'react';

export function TestComponent() {
  return (
    <div style={{ 
      backgroundColor: '#080f17', 
      color: '#d6dde6',
      padding: '40px', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px'
    }}>
      <h1 style={{ 
        color: '#ffffff', 
        fontSize: '48px', 
        fontWeight: 'bold',
        marginBottom: '20px'
      }}>
        VenturesRoom Test Page
      </h1>
      
      <div style={{ 
        backgroundColor: '#1e1e1e', 
        padding: '30px', 
        borderRadius: '16px',
        maxWidth: '600px',
        width: '100%',
        border: '2px solid #c1f17e'
      }}>
        <h2 style={{ color: '#c1f17e', fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
          Dark Mode Test
        </h2>
        <p style={{ color: '#d6dde6', marginBottom: '20px' }}>
          If you can see this text, the dark mode implementation is working correctly.
          We're using direct inline styles to bypass any potential CSS conflicts.
        </p>
        <button style={{ 
          backgroundColor: '#c1f17e', 
          color: '#080f17', 
          padding: '10px 20px',
          borderRadius: '8px',
          fontWeight: 'bold',
          border: 'none'
        }}>
          Test Button
        </button>
      </div>
      
      <div style={{ 
        marginTop: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{ 
          width: '100px', 
          height: '100px', 
          borderRadius: '50%', 
          backgroundColor: '#c1f17e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#080f17',
          fontWeight: 'bold'
        }}>
          Lime
        </div>
        <div style={{ 
          width: '100px', 
          height: '100px', 
          borderRadius: '50%', 
          backgroundColor: '#8A4FFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 'bold'
        }}>
          Purple
        </div>
        <div style={{ 
          width: '100px', 
          height: '100px', 
          borderRadius: '50%', 
          backgroundColor: '#0066FF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 'bold'
        }}>
          Blue
        </div>
      </div>
    </div>
  );
}
