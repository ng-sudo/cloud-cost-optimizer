import React from 'react';

const Input = ({ label, error, helpText, className = '', ...props }) => {
  const id = props.id || props.name;
  
  return (
    <div className={`form-group ${className}`}>
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <input
        id={id}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        {...props}
      />
      {error && <div className="invalid-feedback">{error}</div>}
      {helpText && !error && <div className="form-text">{helpText}</div>}
    </div>
  );
};

const Select = ({ label, error, options = [], className = '', ...props }) => {
  const id = props.id || props.name;
  
  return (
    <div className={`form-group ${className}`}>
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <select
        id={id}
        className={`form-select ${error ? 'is-invalid' : ''}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

const Textarea = ({ label, error, helpText, className = '', ...props }) => {
  const id = props.id || props.name;
  
  return (
    <div className={`form-group ${className}`}>
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <textarea
        id={id}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        {...props}
      />
      {error && <div className="invalid-feedback">{error}</div>}
      {helpText && !error && <div className="form-text">{helpText}</div>}
    </div>
  );
};

export { Input, Select, Textarea };