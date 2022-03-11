import styles from '../styles/Input.module.scss';

const Input = ({
  name,
  type,
  placeholder,
  onChange,
  value,
  disabled,
  options,
  className,
  noDefault,
  rows,
}) => {
  if (type === 'select') {
    return (
      <label className={styles.inputWrap}>
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
        >
          {!noDefault && <option value="">None Selected</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className={styles.placeholder}>{placeholder}</span>
      </label>
    );
  }

  if (type === 'radio') {
    return (
      <div className={`${styles.inputWrap} ${className}`}>
        <div className="radioGroup">
          {options?.map((option) => (
            <label key={option.value}>
              <input
                type="radio"
                value={option.value}
                name={name}
                checked={option.value === value}
                onClick={onChange}
              />
              {option.label}
            </label>
          ))}
        </div>
        <span className="placeholder">{placeholder}</span>
      </div>
    );
  }
  if (type === 'checklist') {
    return (
      <div className={styles.checklistWrap}>
        {options.map((option) => (
          <label key={option.value}>
            <input
              type="checkbox"
              name={name}
              value={option.value}
              checked={value.includes(option.value)}
              onChange={onChange}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <label className={styles.inputWrap}>
        <textarea
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          rows={rows}
        ></textarea>
        <span className={styles.placeholder}>{placeholder}</span>
      </label>
    );
  }

  return (
    <label className={styles.inputWrap}>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      <span className={styles.placeholder}>{placeholder}</span>
    </label>
  );
};

export default Input;
