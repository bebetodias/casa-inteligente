import './Select.css';

export function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Selecione...',
  error,
  isRequired = false,
  hint,
  id,
  ...rest
}) {
  const selectId = id || `select-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className={`field ${error ? 'field--error' : ''}`}>
      {label && (
        <label htmlFor={selectId} className="field__label">
          {label}{isRequired && <span className="field__required">*</span>}
        </label>
      )}
      <div className="select-wrapper">
        <select
          id={selectId}
          className="select"
          value={value}
          onChange={onChange}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="select__chevron" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 9 L12 15 L18 9" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
      {hint && !error && <span className="field__hint">{hint}</span>}
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}