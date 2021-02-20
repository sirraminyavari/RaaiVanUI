/**
 * An input component that animates placeholder position
 */
import Edit from 'components/Icons/Edit';
import { MAIN_BLUE } from 'const/Colors';
import React, { useRef, useState } from 'react';
import {
  Container,
  Error,
  Input,
  InVisibleMe,
  Label,
  Span,
  VisibleMe,
  Maintainer,
  ShakeAnimate,
} from './AnimatedInput.style';

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
  const [inputFocused, setFocused] = useState(false);
  // True if user clicks the 'VisibleMe'.
  //False if user clicks the 'InVisibleMe'.
  const [passVisible, setPassVisible] = useState(false);
  return (
    <Maintainer {...props}>
      <ShakeAnimate isVisible={error && true}>
        <Container
          error={error}
          style={style}
          inputFocused={inputFocused}
          editable={editable}>
          {type === 'password' &&
            (!passVisible ? (
              <VisibleMe onClick={() => setPassVisible(true)} />
            ) : (
              <InVisibleMe onClick={() => setPassVisible(false)} />
            ))}
          {editable && (
            <Edit onClick={onEdit} color={MAIN_BLUE} size={'1.5rem'} />
          )}
          <Label inputFocused={inputFocused}>
            <Input
              id={type}
              value={value}
              type={passVisible ? 'text' : type}
              onFocus={() => setFocused(true)}
              onBlur={(e) => {
                console.log('blurred');
                e.preventDefault();
                setFocused(false);
              }}
              className="textarea"
              disabled={editable}
              onChange={(event) => {
                console.log(event.target.value, 'on event');

                onChange(event.target.value);
              }}
              error={error}></Input>
            <Span value={value} inputFocused={inputFocused}>
              {placeholder}
            </Span>
          </Label>
        </Container>
      </ShakeAnimate>
      <Error error={error}>{error}</Error>
    </Maintainer>
  );
};

export default AnimatedInput;
