import React from 'react';

const Card = ({ title, children, className = '', headerAction }) => {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{title}</h5>
          {headerAction}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default Card;