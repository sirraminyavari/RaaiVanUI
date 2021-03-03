import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import usePeriod from '../../hooks/usePeriod';

const { GlobalUtilities, RV_RTL, RV_Float, RV_RevFloat } = window;

/**
 * @typedef PropType
 * @property {string} type - type of the input e.g. text, password, etc.
 * @property {boolean | string} error - true means there is an error and strgin value means there is an erorr with a message
 * @property {boolean | number} shake - if true or be a positive number, the component will shake for a second
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
  shake,
  className,
  style,
  children,
  ...props
}) => {
  const inputRef = React.createRef();

  const errorMessage =
    GlobalUtilities.get_type(error) == 'string' ? error : null;

  const shaking = usePeriod(shake, {}) && !!error;

  const hasButton = GlobalUtilities.get_type(children) == 'json';

  return (
    <InputContainer>
      <input
        ref={inputRef}
        type={type}
        className={
          'rv-input' +
          (error ? ' rv-input-invalid ' : ' ') +
          (shaking ? ' rv-shake ' : ' ') +
          className
        }
        style={GlobalUtilities.extend(
          style || {},
          {
            position: 'relative',
          },
          !hasButton
            ? {}
            : { [RV_RTL ? 'paddingLeft' : 'paddingRight']: '2.2rem' }
        )}
        {...props}
      />
      {hasButton && <ButtonContainer>{children}</ButtonContainer>}
      {!!errorMessage && (
        <ErrorContainer className="rv-red">{errorMessage}</ErrorContainer>
      )}
    </InputContainer>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  shake: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
};

Input.defaultProps = {
  type: 'text',
  shake: false,
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
