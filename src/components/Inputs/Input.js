import React from 'react';
import PropTypes from 'prop-types';

const { GlobalUtilities } = window;

/**
 * @typedef PropType
 * @property {string} type - type of the input e.g. text, password, etc.
 * @property {boolean} invalid - true if the input value is not valid
 * @property {string} invalid - message the message that is shown if the input value is invalid
 */

/**
 * @description Renders an input element
 * @component
 * @param {PropType} props
 */

const Input = (props) => {
  let { type, invalid, invalidMessage, className, style } = props;

  return (
    <input
      type={type}
      className={
        'rv-input' + (invalid ? ' rv-input-invalid ' : ' ') + className
      }
      style={GlobalUtilities.extend(style || {}, {
        position: 'relative',
      })}
      {...props}></input>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  invalid: PropTypes.bool,
  invalidMessage: PropTypes.string,
};

Input.defaultProps = {
  type: 'text',
};

Input.displayName = 'InputComponent';

export default Input;
