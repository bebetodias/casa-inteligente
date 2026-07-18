import './Badge.css';

const variants = {
  default: 'badge--default',
  brand: 'badge--brand',
  success: 'badge--success',
  warning: 'badge--warning',
  danger: 'badge--danger',
  neutral: 'badge--neutral',
};

export function Badge({ children, variant = 'default', iconBefore, className = '' }) {
  return (
    <span className={`badge ${variants[variant]} ${className}`}>
      {iconBefore && <span className="badge__icon">{iconBefore}</span>}
      {children}
    </span>
  );
}