import './Button.css';

const variants = {
  primary: 'btn--primary',
  secondary: 'btn--secondary',
  subtle: 'btn--subtle',
  danger: 'btn--danger',
  link: 'btn--link',
};

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  iconBefore,
  iconAfter,
  isLoading = false,
  disabled = false,
  type = 'button',
  isBlock = false,
  onClick,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn--${size} ${variants[variant]} ${isBlock ? 'btn--block' : ''}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...rest}
    >
      {isLoading && <span className="btn__spinner" aria-hidden="true" />}
      {iconBefore && <span className="btn__icon">{iconBefore}</span>}
      <span className="btn__label">{children}</span>
      {iconAfter && <span className="btn__icon">{iconAfter}</span>}
    </button>
  );
}