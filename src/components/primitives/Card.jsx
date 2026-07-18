import './Card.css';

export function Card({ children, isInteractive = false, onClick, className = '' }) {
  const Component = onClick ? 'button' : 'div';
  return (
    <Component
      className={`card ${isInteractive ? 'card--interactive' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </Component>
  );
}