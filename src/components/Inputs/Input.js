import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const { GlobalUtilities, RV_Float, RV_RevFloat } = window;

/**
 * @typedef PropType
 * @property {string} type - type of the input e.g. text, password, etc.
 * @property {boolean | string} error - true means there is an error and strgin value means there is an erorr with a message
 * @property {method} onChange - handles the change event of the input
 * @property {object} children - a component that will be rendedred as a button
 */

/**
 * @description Renders an input element
 * @component
 * @param {PropType} props
 */

const Input = ({
  type,
  error,
  onChange,
  className,
  style,
  children,
  ...props
}) => {
  const inputRef = React.createRef();

  const errorMessage =
    GlobalUtilities.get_type(error) == 'string' ? error : null;

  useEffect(() => {
    if (inputRef.current && (window.Object || {}).getOwnPropertyDescriptor) {
      var descriptor = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value'
      );
      var originalSet = descriptor.set;

      descriptor.set = function () {
        originalSet.apply(this, arguments);
        onChange();
      };

      Object.defineProperty(inputRef.current, 'value', descriptor);
    }
  }, [inputRef]);

  return (
    <InputContainer>
      <input
        ref={inputRef}
        type={type}
        className={
          'rv-input' + (error ? ' rv-input-invalid ' : ' ') + className
        }
        style={GlobalUtilities.extend(style || {}, {
          position: 'relative',
        })}
        onChange={onChange}
        {...props}
      />
      {GlobalUtilities.get_type(children) == 'json' && (
        <ButtonContainer>{children}</ButtonContainer>
      )}
      {!!errorMessage && (
        <ErrorContainer className="rv-red">{errorMessage}</ErrorContainer>
      )}
    </InputContainer>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  onChange: PropTypes.func,
};

Input.defaultProps = {
  type: 'text',
  onChange: function (e) {},
};

Input.displayName = 'InputComponent';

export default Input;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const ButtonContainer = styled.div`
  position: absolute;
  display: flex;
  top: 0;
  bottom: 0;
  ${RV_RevFloat}: 0.5rem;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  z-index: 2;
`;

const ErrorContainer = styled.div`
  position: absolute;
  bottom: -1rem;
  height: 1rem;
  font-size: 0.6rem;
  ${RV_Float}: 0.5rem;
`;
