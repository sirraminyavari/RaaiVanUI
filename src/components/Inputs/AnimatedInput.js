/**
 * An input component that animates placeholder position
 */
import Edit from 'components/Icons/Edit';
import React, { useState } from 'react';
import {
  Container,
  StyledInput,
  Label,
  Placeholder,
} from './AnimatedInput.style';

import VisibleIcon from '../Icons/VisibleIcon';
import InvisibleIcon from '../Icons/InVisible';

const { GlobalUtilities, RV_RTL } = window;

/**
 * By user starting to type, placeholder goes on border with some animations
 * @param {String} placeholder -  Placeholder for input.
 * @param {String} type - Defines type of input e.g: password, email,...
 * @param {React.CSSProperties} style - Inline style for 'Container'.
 * @param {String} value - Typed value.
 * @param {String} error - If it has value, the Input border changes to RED and shows the 'error' value under it.
 * @param {Boolean} editable - If True, the user can edit the input value by clicking the 'Edit' icon on the left side of Input.
 * @callback onEdit - Fires by clicking the 'Edit' icon.
 * @callback onChange - Fires when the user typing a new char.
 * @param {object} props - Other params that don't include above.
 */
const AnimatedInput = ({
  placeholder,
  type = 'text',
  style,
  value = '',
  error = null,
  editable = false,
  onEdit,
  onChange,
  ...props
}) => {
  // True if 'Input' is focused.
  const [inputFocused, _setFocused] = useState(false);

  //True if user clicks the 'VisibleMe'.
  //False if user clicks the 'InVisibleMe'.
  const [passVisible, setPassVisible] = useState(false);

  const [inputValue, setInputValue] = useState('');

  const setFocused = (value) => {
    if (GlobalUtilities.get_type(value) != 'boolean')
      value = !!inputValue.length;
    _setFocused(value);
  };

  const hasButton = type === 'password' || editable;

  return (
    <>
      <Container
        style={style}
        inputFocused={inputFocused}
        editable={editable}
        hasButton={!!hasButton}>
        <Label
          className={inputFocused ? 'active' : ''}
          inputFocused={inputFocused}>
          <StyledInput
            value={value}
            type={passVisible ? 'text' : type}
            style={{
              [RV_RTL ? 'paddingLeft' : 'paddingRight']: '2.2rem',
            }}
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
              e.preventDefault();
              setFocused();
            }}
            disabled={editable}
            onChange={(event) => {
              setInputValue(event.target.value);
              onChange(event.target.value);
              setFocused();
            }}
            error={error}
            onMouseDown={(e) => e.nativeEvent.stopImmediatePropagation()}>
            {!hasButton ? null : type === 'password' ? (
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
            )}
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
