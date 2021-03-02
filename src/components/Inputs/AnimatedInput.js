/**
 * An input component that animates placeholder position
 */
import React, { useState } from 'react';
import {
  Container,
  StyledInput,
  Label,
  Placeholder,
} from './AnimatedInput.style';

const { GlobalUtilities } = window;

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
 */
const AnimatedInput = ({
  placeholder,
  type = 'text',
  style,
  value = '',
  error = null,
  /*
  editable = false,
  onEdit,
  */
  onFocus,
  onBlur,
  onChange,
  children,
  ...props
}) => {
  // True if 'Input' is focused.
  const [inputFocused, _setFocused] = useState(!!value);

  /*
  //True if user clicks the 'VisibleMe'.
  //False if user clicks the 'InVisibleMe'.
  const [passVisible, setPassVisible] = useState(false);
  */
  const [inputValue, setInputValue] = useState('');

  const setFocused = (value) => {
    if (GlobalUtilities.get_type(value) != 'boolean')
      value = !!inputValue.length;
    _setFocused(value);
  };

  return (
    <>
      <Container style={style} inputFocused={inputFocused}>
        <Label
          className={inputFocused ? 'active' : ''}
          inputFocused={inputFocused}>
          <StyledInput
            value={value}
            type={type}
            onFocus={(e) => {
              if (GlobalUtilities.get_type(onFocus) == 'function') onFocus(e);
              setFocused(true);
            }}
            onBlur={(e) => {
              e.preventDefault();
              if (GlobalUtilities.get_type(onBlur) == 'function') onBlur(e);
              setFocused();
            }}
            onChange={(event) => {
              setInputValue(event.target.value);
              onChange(event.target.value);
              setFocused();
            }}
            error={error}
            onMouseDown={(e) => e.nativeEvent.stopImmediatePropagation()}
            {...props}>
            {/*
              !hasButton ? null : type === 'password' ? (
                passVisible ? (
                  <InvisibleIcon
                    className="rv-gray"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setPassVisible(false)}
                  />
                ) : (
                  <VisibleIcon
                    className="rv-gray"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setPassVisible(true)}
                  />
                )
              ) : (
                <Edit
                  style={{ cursor: 'pointer' }}
                  onClick={onEdit}
                  size={'1.5rem'}
                />
              )
              */}
            {children}
          </StyledInput>
          <Placeholder
            className={`rv-border-radius-quarter ${
              inputFocused ? 'rv-warm' : 'rv-gray'
            }`}>
            {placeholder}
          </Placeholder>
        </Label>
      </Container>
    </>
  );
};

export default AnimatedInput;
