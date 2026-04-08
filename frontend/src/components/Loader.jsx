import React from 'react';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-primary">
      <div className="text-center">
        {/* Spinner */}
        <div className="mb-6 flex justify-center">
          <div className="relative w-16 h-16">
            <div
              className="absolute inset-0 rounded-full border-4 border-hover"
              style={{
                borderTopColor: '#00ff88',
                animation: 'spin 1s linear infinite'
              }}
            ></div>
          </div>
        </div>

        {/* Loading Message */}
        <p className="text-lg font-semibold text-accent">{message}</p>

        {/* CSS Animation */}
        <style>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Loader;
