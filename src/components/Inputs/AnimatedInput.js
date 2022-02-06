/**
 * An input component that animates placeholder position
 */
import React, { useEffect, useRef, useState } from 'react';
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
 * @param {Boolean|number} - if True, shakes component for 500ms, with this {setShake(GlobalUtilities.random())} will shake randomly
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
      afterChangeListener,
      children,
      placeholderClass,
      placeholderFocusedClass,
      ...props
    },
    ref
  ) => {
    // True if 'Input' is focused.
    const [inputFocused, _setFocused] = useState(!!value);
    const [placeHolderState, setPlaceHolderState] = useState(placeholder);

    const labelRef = useRef();
    const placeHolderRef = useRef();
    const childrenRef = useRef();
    /**
     * Changes input focusing according to input value
     * @param {Boolean} focused - Defines input should be focus or not.
     */
    useEffect(() => {
      normalizePlaceHolder();
    }, [labelRef?.current?.offsetWidth]);

    const setFocused = (focused) => {
      if (!focused && value?.length === 0) {
        _setFocused(focused);
      } else {
        _setFocused(true);
      }
    };

    const normalizePlaceHolder = () => {
      if (
        labelRef?.current?.offsetWidth -
          placeHolderRef?.current?.offsetWidth -
          childrenRef?.current?.offsetWidth <
        10
      ) {
        setPlaceHolderState(placeHolderState.slice(0, -1));
      } else {
        setPlaceHolderState(placeholder);
      }
    };

    const PlaceHolderClassFocused = placeholderFocusedClass
      ? placeholderFocusedClass
      : 'rv-warm';
    const PlaceHolderClass = placeholderClass ? placeholderClass : 'rv-distant';
    return (
      <Container style={style} inputFocused={inputFocused} {...props}>
        <Label
          ref={labelRef}
          error={error}
          className={inputFocused || value.length > 0 ? 'active ' : ''}
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
            afterChangeListener={afterChangeListener}
            onBlur={(e) => {
              e.preventDefault();
              setFocused(false);
            }}
            error={error}
            onMouseDown={(e) => e.nativeEvent.stopImmediatePropagation()}
            {...props}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              ref={childrenRef}>
              {children}
            </div>
          </StyledInput>

          <Placeholder
            ref={placeHolderRef}
            inputFocused={inputFocused}
            maxWidth={labelRef?.current?.offsetWidth}
            style={{ display: 'flex' }}
            className={`rv-border-radius-quarter rv-distant ${
              inputFocused || value.length > 0
                ? PlaceHolderClassFocused
                : PlaceHolderClass
            }`}>
            {placeHolderState}
          </Placeholder>
        </Label>
      </Container>
    );
  }
);

export default AnimatedInput;

// ${
//   placeHolderRef?.current?.offsetWidth -
//     labelRef?.current?.offsetWidth -
//     childrenRef?.current?.offsetWidth >
//     10 && 'Ellipsis'
// }
