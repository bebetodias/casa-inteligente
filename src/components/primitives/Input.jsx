import './Input.css';

export function Input({
  label,
  hint,
  error,
  isRequired = false,
  id,
  ...rest
}) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;
  const describedBy = [hint && `${inputId}-hint`, error && `${inputId}-error`]
    .filter(Boolean).join(' ') || undefined;

  return (
    <div className={`field ${error ? 'field--error' : ''}`}>
      {label && (
        <label htmlFor={inputId} className="field__label">
          {label}{isRequired && <span className="field__required">*</span>}
        </label>
      )}
      <input id={inputId} className="field__input" aria-describedby={describedBy} {...rest} />
      {hint && !error && <span id={`${inputId}-hint`} className="field__hint">{hint}</span>}
      {error && <span id={`${inputId}-error`} className="field__error">{error}</span>}
    </div>
  );
}