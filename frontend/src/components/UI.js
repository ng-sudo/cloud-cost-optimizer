import React from 'react';

// Container component
export const Container = ({ children, fluid = false, className = '' }) => (
  <div className={`container${fluid ? '-fluid' : ''} ${className}`}>{children}</div>
);

// Row component
export const Row = ({ children, className = '' }) => (
  <div className={`row ${className}`}>{children}</div>
);

// Col component
export const Col = ({ children, xs, sm, md, lg, xl, className = '' }) => {
  const colClasses = [];
  if (xs) colClasses.push(`col-${xs}`);
  if (sm) colClasses.push(`col-sm-${sm}`);
  if (md) colClasses.push(`col-md-${md}`);
  if (lg) colClasses.push(`col-lg-${lg}`);
  if (xl) colClasses.push(`col-xl-${xl}`);
  if (!xs && !sm && !md && !lg && !xl) colClasses.push('col');
  
  return <div className={`${colClasses.join(' ')} ${className}`}>{children}</div>;
};

// Card component
export const Card = ({ children, className = '', ...props }) => (
  <div className={`card ${className}`} {...props}>{children}</div>
);

export const CardHeader = ({ children, className = '' }) => (
  <div className={`card-header ${className}`}>{children}</div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`card-body ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`card-footer ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h5 className={`card-title ${className}`}>{children}</h5>
);

export const CardText = ({ children, className = '' }) => (
  <p className={`card-text ${className}`}>{children}</p>
);

// Button component
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  ...props 
}) => (
  <button
    type={type}
    className={`btn btn-${variant} btn-${size} ${className} ${disabled ? 'disabled' : ''} ${loading ? 'loading' : ''}`}
    disabled={disabled || loading}
    onClick={onClick}
    {...props}
  >
    {loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>}
    {children}
  </button>
);

// Form components
export const Form = ({ children, onSubmit, className = '', ...props }) => (
  <form className={className} onSubmit={onSubmit} {...props}>{children}</form>
);

export const FormGroup = ({ children, className = '', ...props }) => (
  <div className={`form-group ${className}`} {...props}>{children}</div>
);

export const Label = ({ children, htmlFor, className = '', required = false, ...props }) => (
  <label htmlFor={htmlFor} className={`form-label ${className}`} {...props}>
    {children}
    {required && <span className="text-danger ms-1">*</span>}
  </label>
);

export const Input = ({ 
  className = '', 
  invalid = false, 
  valid = false,
  type = 'text',
  id,
  ...props 
}) => (
  <input
    type={type}
    id={id}
    className={`form-control ${invalid ? 'is-invalid' : ''} ${valid ? 'is-valid' : ''} ${className}`}
    {...props}
  />
);

export const Textarea = ({ className = '', invalid = false, id, ...props }) => (
  <textarea
    id={id}
    className={`form-control ${invalid ? 'is-invalid' : ''} ${className}`}
    {...props}
  />
);

export const Select = ({ className = '', invalid = false, id, children, ...props }) => (
  <select
    id={id}
    className={`form-select ${invalid ? 'is-invalid' : ''} ${className}`}
    {...props}
  >
    {children}
  </select>
);

export const Option = ({ children, value, ...props }) => (
  <option value={value} {...props}>{children}</option>
);

export const FormText = ({ children, className = '', muted = true, ...props }) => (
  <div className={`form-text ${muted ? 'text-muted' : ''} ${className}`} {...props}>{children}</div>
);

export const InvalidFeedback = ({ children, className = '' }) => (
  <div className={`invalid-feedback ${className}`}>{children}</div>
);

export const ValidFeedback = ({ children, className = '' }) => (
  <div className={`valid-feedback ${className}`}>{children}</div>
);

// Alert component
export const Alert = ({ children, variant = 'info', className = '', dismissible = false, onClose, ...props }) => (
  <div 
    className={`alert alert-${variant} ${dismissible ? 'alert-dismissible fade show' : ''} ${className}`}
    role="alert"
    {...props}
  >
    {children}
    {dismissible && (
      <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
    )}
  </div>
);

// Badge component
export const Badge = ({ children, variant = 'secondary', className = '', ...props }) => (
  <span className={`badge bg-${variant} ${className}`} {...props}>{children}</span>
);

// Spinner component
export const Spinner = ({ variant = 'primary', size = 'md', className = '', ...props }) => (
  <div className={`spinner-${size === 'sm' ? 'spinner-border-sm' : size === 'lg' ? 'spinner-border-lg' : 'spinner-border'} text-${variant} ${className}`} role="status" {...props}>
    <span className="visually-hidden">Loading...</span>
  </div>
);

// Table component
export const Table = ({ children, striped = false, bordered = false, hover = true, responsive = true, className = '', ...props }) => {
  const tableClasses = ['table'];
  if (striped) tableClasses.push('table-striped');
  if (bordered) tableClasses.push('table-bordered');
  if (hover) tableClasses.push('table-hover');
  
  const table = (
    <table className={tableClasses.join(' ')} {...props}>
      {children}
    </table>
  );
  
  if (responsive) {
    return <div className="table-responsive">{table}</div>;
  }
  return table;
};

export const Thead = ({ children, className = '', ...props }) => (
  <thead className={className} {...props}>{children}</thead>
);

export const Tbody = ({ children, className = '', ...props }) => (
  <tbody className={className} {...props}>{children}</tbody>
);

export const Tr = ({ children, className = '', ...props }) => (
  <tr className={className} {...props}>{children}</tr>
);

export const Th = ({ children, className = '', scope = 'col', ...props }) => (
  <th scope={scope} className={className} {...props}>{children}</th>
);

export const Td = ({ children, className = '', ...props }) => (
  <td className={className} {...props}>{children}</td>
);

// Pagination component
export const Pagination = ({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange, 
  className = '',
  maxVisible = 5 
}) => {
  if (totalPages <= 1) return null;
  
  const pages = [];
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return (
    <nav aria-label="Pagination">
      <ul className={`pagination ${className}`}>
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange && onPageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
        </li>
        {start > 1 && (
          <>
            <li className="page-item"><button className="page-link" onClick={() => onPageChange && onPageChange(1)}>1</button></li>
            {start > 2 && <li className="page-item disabled"><span className="page-link">...</span></li>}
          </>
        )}
        {pages.map(page => (
          <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onPageChange && onPageChange(page)}>{page}</button>
          </li>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <li className="page-item disabled"><span className="page-link">...</span></li>}
            <li className="page-item"><button className="page-link" onClick={() => onPageChange && onPageChange(totalPages)}>{totalPages}</button></li>
          </>
        )}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange && onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

// Modal component
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md', 
  centered = true,
  className = '' 
}) => {
  if (!isOpen) return null;
  
  const sizeClasses = {
    sm: 'modal-sm',
    md: '',
    lg: 'modal-lg',
    xl: 'modal-xl',
    fullscreen: 'modal-fullscreen'
  };
  
  return (
    <div className="modal-backdrop fade show" onClick={onClose}>
      <div className={`modal ${centered ? 'modal-dialog-centered' : ''} ${className}`} tabIndex="-1" role="dialog">
        <div className={`modal-dialog ${sizeClasses[size]}`}>
          <div className="modal-content">
            {title && (
              <div className="modal-header">
                <h5 className="modal-title">{title}</h5>
                <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
              </div>
            )}
            <div className="modal-body">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dropdown component
export const Dropdown = ({ trigger, items, className = '', align = 'end' }) => {
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);
  
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <div className={`dropdown ${className}`} ref={dropdownRef}>
      <button 
        className="btn btn-secondary dropdown-toggle" 
        type="button" 
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {trigger}
      </button>
      {open && (
        <div className={`dropdown-menu dropdown-menu-${align} show`}>
          {items.map((item, index) => (
            <button 
              key={index} 
              className="dropdown-item" 
              onClick={() => { item.onClick?.(); setOpen(false); }}
              disabled={item.disabled}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Tabs component
export const Tabs = ({ tabs, activeTab, onChange, className = '' }) => (
  <div className={className}>
    <ul className="nav nav-tabs" role="tablist">
      {tabs.map((tab, index) => (
        <li key={index} className="nav-item" role="presentation">
          <button
            className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onChange(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
          >
            {tab.label}
            {tab.badge && <Badge variant="secondary" className="ms-1">{tab.badge}</Badge>}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export const TabPanel = ({ active, children }) => (
  <div className={`tab-pane ${active ? 'show active' : ''}`} role="tabpanel">
    {children}
  </div>
);

// Accordion component
export const Accordion = ({ children, className = '', flush = false }) => (
  <div className={`accordion ${flush ? 'accordion-flush' : ''} ${className}`}>
    {children}
  </div>
);

export const AccordionItem = ({ children, className = '' }) => (
  <div className={`accordion-item ${className}`}>{children}</div>
);

export const AccordionHeader = ({ children, className = '' }) => (
  <h2 className={`accordion-header ${className}`}>{children}</h2>
);

export const AccordionButton = ({ 
  children, 
  expanded = false, 
  onClick, 
  target, 
  className = '' 
}) => (
  <button
    className={`accordion-button ${!expanded ? 'collapsed' : ''} ${className}`}
    type="button"
    data-bs-toggle="collapse"
    data-bs-target={target}
    aria-expanded={expanded}
    aria-controls={target?.replace('#', '')}
    onClick={onClick}
  >
    {children}
  </button>
);

export const AccordionCollapse = ({ id, children, className = '' }) => (
  <div id={id} className={`accordion-collapse collapse ${className}`}>
    <div className="accordion-body">{children}</div>
  </div>
);

// ListGroup component
export const ListGroup = ({ children, className = '', flush = false }) => (
  <div className={`list-group ${flush ? 'list-group-flush' : ''} ${className}`}>{children}</div>
);

export const ListGroupItem = ({ 
  children, 
  active = false, 
  disabled = false, 
  action = false, 
  className = '',
  onClick,
  ...props 
}) => (
  <button
    type="button"
    className={`list-group-item ${action ? 'list-group-item-action' : ''} ${active ? 'active' : ''} ${disabled ? 'disabled' : ''} ${className}`}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

// Progress component
export const Progress = ({ value = 0, max = 100, variant = 'primary', striped = false, animated = false, className = '', label, ...props }) => (
  <div className="progress" style={{ height: '1rem' }} {...props}>
    <div 
      className={`progress-bar bg-${variant} ${striped ? 'progress-bar-striped' : ''} ${animated ? 'progress-bar-animated' : ''}`}
      role="progressbar"
      style={{ width: `${Math.min(100, Math.max(0, (value / max) * 100))}%` }}
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      {label}
    </div>
  </div>
);

// Toast component
export const Toast = ({ 
  children, 
  variant = 'info', 
  onClose, 
  autoHide = true, 
  delay = 5000,
  className = '' 
}) => {
  const [visible, setVisible] = React.useState(true);
  
  React.useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => setVisible(false), delay);
      return () => clearTimeout(timer);
    }
  }, [autoHide, delay]);
  
  if (!visible) return null;
  
  return (
    <div className={`toast align-items-center text-white bg-${variant} border-0 ${className}`} role="alert" aria-live="assertive" aria-atomic="true">
      <div className="d-flex">
        <div className="toast-body">{children}</div>
        <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => { setVisible(false); onClose?.(); }} aria-label="Close"></button>
      </div>
    </div>
  );
};

// Tooltip component
export const Tooltip = ({ title, children, placement = 'top', className = '' }) => {
  const [show, setShow] = React.useState(false);
  const ref = React.useRef(null);
  
  return (
    <div className={`position-relative ${className}`} ref={ref} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className={`tooltip tooltip-${placement} show`} role="tooltip">
          <div className="tooltip-arrow"></div>
          <div className="tooltip-inner">{title}</div>
        </div>
      )}
    </div>
  );
};

// Breadcrumb component
export const Breadcrumb = ({ items, className = '' }) => (
  <nav aria-label="breadcrumb" className={className}>
    <ol className="breadcrumb">
      {items.map((item, index) => (
        <li key={index} className={`breadcrumb-item ${index === items.length - 1 ? 'active' : ''}`} aria-current={index === items.length - 1 ? 'page' : undefined}>
          {item.href ? <a href={item.href}>{item.label}</a> : item.label}
        </li>
      ))}
    </ol>
  </nav>
);

// InputGroup component
export const InputGroup = ({ children, className = '' }) => (
  <div className={`input-group ${className}`}>{children}</div>
);

export const InputGroupText = ({ children, className = '' }) => (
  <span className={`input-group-text ${className}`}>{children}</span>
);

// FormCheck component
export const FormCheck = ({ 
  label, 
  type = 'checkbox', 
  id, 
  name, 
  checked, 
  onChange, 
  disabled = false, 
  className = '',
  inline = false 
}) => (
  <div className={`form-check ${inline ? 'form-check-inline' : ''} ${className}`}>
    <input
      className="form-check-input"
      type={type}
      id={id}
      name={name}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
    <label className="form-check-label" htmlFor={id}>{label}</label>
  </div>
);

// Divider component
export const Divider = ({ className = '', vertical = false }) => (
  <hr className={`${vertical ? 'vr' : 'hr'} ${className}`} />
);