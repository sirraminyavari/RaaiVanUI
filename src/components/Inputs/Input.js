import React from 'react';
import PropTypes from 'prop-types';

/**
 * @typedef PropType
 * @property {string} type - type of the input e.g. text, password, etc.
 * @property {boolean} invalid - true if the input value is not valid
 */

/**
 * @description Renders an input element
 * @component
 * @param {PropType} props
 */

const Input = (props) => {
  let { type, invalid, className } = props;

  return (
    <input
      type={type}
      className={
        'rv-input' + (invalid ? ' rv-input-invalid ' : ' ') + className
      }
      {...props}
    />
  );
};

Input.propTypes = {
  type: PropTypes.string,
  invalid: PropTypes.bool,
};

Input.defaultProps = {
  type: 'text',
};

Input.displayName = 'InputComponent';

export default Input;
