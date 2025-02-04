import React from 'react';

function GeolocationPopup() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        textAlign: 'center',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Access Restricted</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
      Yor location is of or You are currently outside the allowed area. Please move within the specified area to use Work Sync.
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          padding: '10px 20px',
          fontSize: '1rem',
          backgroundColor: '#f5c6cb',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Retry
      </button>
    </div>
  );
}

export default GeolocationPopup;
