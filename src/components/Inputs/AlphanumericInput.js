import { forwardRef } from 'react';
import PropTypes from 'prop-types';

const AlphanumericInput = forwardRef((props, ref) => {
  const {
    maxLength,
    maxDecimal,
    onInputChange,
    inputValue,
    initial = '',
    isFloat = false,
    isNumber = false,
    ...rest
  } = props;

  const inputPattern = () => {
    let ml = maxLength;
    let md = maxDecimal;
    if (isNumber) {
      if (isFloat) {
        return `^\\d${ml ? `{0,${ml}}` : '*'}(\\.\\d${
          md ? `{0,${md}}` : '*'
        })?$`;
      } else {
        return `[0-9]${ml ? `{0,${md}}` : '*'}`;
      }
    } else {
      return '[A-Za-z0-9]*';
    }
  };

  const handleChange = (e) => {
    if (!e.target.validity.valid) return;
    onInputChange && onInputChange(e.target.value);
  };

  return (
    <input
      type="text"
      ref={ref}
      pattern={inputPattern()}
      onChange={handleChange}
      defaultValue={initial}
      value={inputValue}
      {...rest}
    />
  );
});

AlphanumericInput.propTypes = {
  maxLength: PropTypes.number,
  maxDecimal: PropTypes.number,
  isFloat: PropTypes.bool,
  isNumber: PropTypes.bool,
  onInputChange: PropTypes.func,
  inputValue: PropTypes.string,
  initial: PropTypes.string,
};

export default AlphanumericInput;
