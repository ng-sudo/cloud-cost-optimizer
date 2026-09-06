import React from 'react';

const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizeClasses = {
    sm: 'spinner-sm',
    md: 'spinner-md',
    lg: 'spinner-lg',
  };
  
  return (
    <div className={`loading-spinner ${sizeClasses[size]}`}>
      <div className="spinner"></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;