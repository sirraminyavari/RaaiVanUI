import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import * as Styled from './AlphanumericInput.styles';

/**
 * @typedef RefType
 * @property {Object} current -The object that represents the current ref.
 */

/**
 * @typedef PropType
 * @property {RefType} ref
 * @property {number} maxLength -The maximum length of the digit that is allowed for input.
 * @property {number} maxDecimal -The maximum length of decimal that is allowed for input.
 * @property {boolean} isFloat -The parameter that indicates is input allowed to be a float number.
 * @property {boolean} isNumber -The parameter that indicates is input allowed to be only a number or not.
 * @property {function} onInputChange -The function that receives input value.
 * @property {string} inputValue -The current value of input.
 */

/**
 * @description Renders an alphanumeric or numeric input.
 * @type {React.FC<PropType>}
 */
const AlphanumericInput = forwardRef((props, ref) => {
  const {
    maxLength,
    maxDecimal,
    onInputChange,
    inputValue,
    isFloat,
    isNumber,
    ...rest
  } = props;

  //! Returns input pattern based on props.
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

  //! Calls when input value changes and pass it to parent component.
  const handleChange = (e) => {
    if (!e.target.validity.valid) return;
    onInputChange && onInputChange(e.target.value);
  };

  return (
    <Styled.Input
      data-testid="alphanumeric-input"
      className="BorderRadius4"
      type="text"
      ref={ref}
      pattern={inputPattern()}
      onChange={handleChange}
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
  onInputChange: PropTypes.func.isRequired,
  inputValue: PropTypes.string.isRequired,
};

AlphanumericInput.defaultProps = {
  isFloat: false,
  isNumber: false,
};

AlphanumericInput.displayName = 'AlphanumericInput';

export default AlphanumericInput;
