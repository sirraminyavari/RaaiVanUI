import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import usePeriod from '../../hooks/usePeriod';
// import { WindowContext } from '../../context/WindowProvider';

/**
 * @typedef PropType
 * @property {string} type - type of the input e.g. text, password, etc.
 * @property {boolean | string} error - true means there is an error and strgin value means there is an erorr with a message
 * @property {boolean | number} shake - if true or be a positive number, the component will shake for a second
 * @property {method} afterChangeListener - fires after a timeout after keydown event
 * @property {method} enterListener - fires when the user presses Enter key
 * @property {method} changeOrEnterListener - a combination of 'afterChangeListener' & 'enterListener'
 * @property {number} timeout - determines the timeout for 'afterChangeListener' and 'onEnterOrChange' events
 * @property {object} children - a component that will be rendedred as a button
 */

/**
 * @description Renders an input element
 * @component
 * @param {PropType} props
 */

const { GlobalUtilities, RV_RTL, RV_Float, RV_RevFloat } = window;
const Input = React.forwardRef(
  (
    {
      type,
      error,
      shake,
      afterChangeListener,
      enterListener,
      changeOrEnterListener,
      timeout,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const errorMessage =
      GlobalUtilities.get_type(error) === 'string' ? error : null;

    const shaking = usePeriod(shake, {}, GlobalUtilities) && !!error;

    const hasButton = GlobalUtilities.get_type(children) === 'json';

    //handle key down events: afterChangeListener, enterListener, changeOrEnterListener
    const hasKeyDownAction = [
      afterChangeListener,
      enterListener,
      changeOrEnterListener,
    ].some((fn) => GlobalUtilities.get_type(fn) === 'function');

    const hasChangeAction = [afterChangeListener, changeOrEnterListener].some(
      (fn) => GlobalUtilities.get_type(fn) === 'function'
    );

    const [changeTimeout, setChangeTimeout] = useState(null);

    const clearChangeTimeout = () => {
      if (changeTimeout) {
        clearTimeout(changeTimeout);
        setChangeTimeout(null);
      }
    };

    useEffect(() => {
      return () => clearChangeTimeout();
    }, []);

    const handleKeyDown = !hasKeyDownAction
      ? null
      : (e) => {
          if (e.which === 17) return; //13: enter, 17: ctrl

          clearChangeTimeout();

          if (e.which === 13) {
            if (GlobalUtilities.get_type(enterListener) === 'function')
              enterListener(e);
            if (GlobalUtilities.get_type(changeOrEnterListener) === 'function')
              changeOrEnterListener(e);
          } else if (hasChangeAction) {
            const to = setTimeout(() => {
              if (GlobalUtilities.get_type(afterChangeListener) === 'function')
                afterChangeListener(e);
              if (
                GlobalUtilities.get_type(changeOrEnterListener) === 'function'
              )
                changeOrEnterListener(e);
            }, timeout);

            setChangeTimeout(to);
          }
        };
    //end of handle key down events

    return (
      <InputContainer>
        <input
          ref={ref}
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
          onKeyUp={handleKeyDown}
          autoComplete="off"
          {...props}
        />
        {hasButton && <ButtonContainer>{children}</ButtonContainer>}
        {!!errorMessage && (
          <ErrorContainer className="rv-red">{errorMessage}</ErrorContainer>
        )}
      </InputContainer>
    );
  }
);

Input.propTypes = {
  type: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  shake: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  afterChangeListener: PropTypes.func,
  enterListener: PropTypes.func,
  changeOrEnterListener: PropTypes.func,
};

Input.defaultProps = {
  type: 'text',
  shake: false,
  timeout: 1000,
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
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  z-index: 2;
  ${RV_RevFloat}:0.5rem
`;

const ErrorContainer = styled.div`
  position: absolute;
  bottom: -1rem;
  height: 1rem;
  font-size: 0.6rem;
  ${RV_Float}:0.5rem
`;
