import { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Renders an alphanumeric input.
 * @component
 */
const AlphanumericInput = forwardRef((props, ref) => {
  const {
    maxLength,
    maxDecimal,
    onInputChange,
    inputValue,
    initial,
    isFloat,
    isNumber,
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
  /**
   * @param {number} props.maxLength -The maximum length of digit allowed for input.
   */
  maxLength: PropTypes.number,
  /**
   * @param {number} props.maxDecimal -The maximum length of decimal allowed for input.
   */
  maxDecimal: PropTypes.number,
  /**
   * @param {boolean} props.isFloat -The parameter that indicates if input allowed to be float.
   */
  isFloat: PropTypes.bool,
  /**
   * @param {boolean} props.isNumber -The parameter that indicates if input allowed to be only number.
   */
  isNumber: PropTypes.bool,
  /**
   * @param {function} props.onInputChange -The function that receives input value.
   */
  onInputChange: PropTypes.func,
  /**
   * @param {string} props.inputValue -The current value of input.
   */
  inputValue: PropTypes.string,
  /**
   * @param {string} props.initial -The default value of input.
   */
  initial: PropTypes.string,
};

AlphanumericInput.defaultProps = {
  isFloat: false,
  isNumber: false,
  initial: '',
};

export default AlphanumericInput;
