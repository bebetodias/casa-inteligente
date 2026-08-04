import './Select.css';
import { ChevronDownIcon } from '../../utils/Icons';

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
          <ChevronDownIcon size={16} />
        </span>
      </div>
      {hint && !error && <span className="field__hint">{hint}</span>}
      {error && <span className="field__error">{error}</span>}
    </div>
  );
}