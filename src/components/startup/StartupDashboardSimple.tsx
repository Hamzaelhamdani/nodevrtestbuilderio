import React from 'react';

export function StartupDashboardSimple({ user, navigate }: any) {
  const handleClick = () => {
    console.log('BOUTON SIMPLE CLIQUÉ !');
    alert('Bouton simple fonctionne !');
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
      <h1>Dashboard Simple - {user?.email}</h1>
      
      <div style={{ margin: '20px 0' }}>
        <button 
          onClick={handleClick}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Bouton Test Simple
        </button>
      </div>

      <div style={{ margin: '20px 0' }}>
        <button 
          onClick={() => {
            console.log('Bouton Add Product simple cliqué');
            alert('Add Product simple');
          }}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}
        >
          Add Product Simple
        </button>

        <button 
          onClick={() => {
            console.log('Bouton Edit simple cliqué');
            alert('Edit simple');
          }}
          style={{
            backgroundColor: '#f59e0b',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            marginRight: '10px'
          }}
        >
          Edit Simple
        </button>

        <button 
          onClick={() => {
            console.log('Bouton Delete simple cliqué');
            alert('Delete simple');
          }}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Delete Simple
        </button>
      </div>

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#374151', borderRadius: '8px' }}>
        <h2>État utilisateur:</h2>
        <pre style={{ color: '#d1d5db', fontSize: '14px' }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  );
}
