/**
 * An input component that animates placeholder position
 */
import React, { useRef, useState } from 'react';
import {
  Container,
  Label,
  Placeholder,
  StyledInput,
} from './AnimatedInput.style';

/**
 * By user starting to type, placeholder goes on border with some animations
 * @param {String} placeholder -  Placeholder for input.
 * @param {String} type - Defines type of input e.g: password, email,...
 * @param {React.CSSProperties} style - Inline style for 'Container'.
 * @param {String} value - Typed value.
 * @param {String} error - If it has value, the Input border changes to RED and shows the 'error' value under it.
 * @callback onFocus - Fires when the input receives the focus.
 * @callback onBlur - Fires when the loses the focus.
 * @callback onChange - Fires when the user typing a new char.
 * @param {object} props - Other params that don't include above.
 * @param {Boolean||setShake(GlobalUtilities.random())} - if True, shakes component for 500ms, with this {setShake(GlobalUtilities.random())} will shake randomly
 */
const AnimatedInput = React.forwardRef(
  (
    {
      placeholder,
      type = 'text',
      style,
      value = '',
      error = null,
      disabled,
      onChange,
      children,
      ...props
    },
    ref
  ) => {
    // True if 'Input' is focused.
    const [inputFocused, _setFocused] = useState(!!value);

    /**
     * Changes input focusing according to input value
     * @param {Boolean} focused - Defines input should be focus or not.
     */
    const setFocused = (focused) => {
      if (!focused && value?.length === 0) {
        _setFocused(focused);
      } else {
        _setFocused(true);
      }
    };

    return (
      <Container style={style} inputFocused={inputFocused} {...props}>
        <Label
          error={error}
          className={inputFocused || value.length > 0 ? 'active' : ''}
          inputFocused={inputFocused || value.length > 0}>
          <StyledInput
            value={value}
            type={type}
            disabled={disabled}
            ref={ref}
            onFocus={() => {
              setFocused(true);
            }}
            onChange={(event) => {
              onChange(event.target.value);
            }}
            onBlur={(e) => {
              e.preventDefault();
              setFocused(false);
            }}
            error={error}
            onMouseDown={(e) => e.nativeEvent.stopImmediatePropagation()}
            {...props}>
            {children}
          </StyledInput>
          <Placeholder
            className={`rv-border-radius-quarter ${
              inputFocused || value.length > 0 ? 'rv-warm' : 'rv-gray'
            }`}>
            {placeholder}
          </Placeholder>
        </Label>
      </Container>
    );
  }
);

export default AnimatedInput;
