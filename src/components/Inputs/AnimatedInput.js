/**
 * An input component that animates placeholder position
 */
import React, { useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import styled from 'styled-components';

const { RV_Float } = window;

const AnimatedInput = ({
  placeholder,
  type = 'text',
  style,
  onChange,
  value = '',
  error,
}) => {
  const [inputFocused, setFocused] = useState(false);
  const [passVisible, setPassVisible] = useState(false);

  return (
    <Container error={error} style={style}>
      {type === 'password' &&
        (!passVisible ? (
          <VisibleMe onClick={() => setPassVisible(true)} />
        ) : (
          <InVisibleMe onClick={() => setPassVisible(false)} />
        ))}
      <Label inputFocused={inputFocused}>
        <Input
          id={'animated_input'}
          value={value}
          type={passVisible ? 'text' : type}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          error={error}></Input>
        <Span value={value} inputFocused={inputFocused}>
          {placeholder}
        </Span>
      </Label>

      {error && <Error>!</Error>}
    </Container>
  );
};

export default AnimatedInput;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 13px;
  width: 90%;
  align-self: center;
  flex-direction: row;
  border: ${({ error }) => (error ? 'solid 0.5px red' : 'solid 0.9px #bac9dc')};
  border-radius: 7px;
`;

const Label = styled.label`
  position: relative;
  display: block;
  width: 100%;
  border-radius: 7px;

  ${({ inputFocused }) =>
    inputFocused &&
    `
    background-color: #ffffff;
    text-transform: uppercase;
    letter-spacing: .8px;
    font-size: 11px;
    line-height: 14px;
    -webkit-transform: translateY(0);
    transform: translateY(0);
   

    `};
`;

const Input = styled.input`
  position: relative;
  width: 100%;
  outline: none;
  padding: 11px 0px 10px 11px;
  color: #2c3235;
  letter-spacing: 0.2px;
  font-weight: 400;
  font-size: 16px;
  resize: none;
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;
  text-align: ${RV_Float};
  padding-right: 13px;
  border: none;
  border-radius: 7px;
`;

const Span = styled.span`
  position: absolute;
  top: 50%;
  display: block;
  padding: 0 10px;
  white-space: nowrap;
  letter-spacing: 0.2px;
  font-weight: normal;
  font-size: 16px;
  -webkit-transition: all, 0.2s;
  transition: all, 0.2s;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
  pointer-events: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border-radius: 0.25rem;
  -moz-border-radius: 0.25rem;
  -webkit-border-radius: 0.25rem;
  text-align: ${RV_Float};
  width: 100%;
  top: ${({ inputFocused }) => (inputFocused ? `-9px` : `50%`)};
  color: ${({ inputFocused, value }) =>
    inputFocused ? `black` : value.length > 0 ? 'rgba(0,0,0,0)' : `#707070`};
  font-size: ${({ inputFocused }) => (inputFocused ? `11px` : `16px`)};
`;
const Error = styled.span`
  color: red;
  font-size: 23px;
  margin-left: 13px;
  position: relative;
  left: 1px;
`;
const VisibleMe = styled(AiFillEye)`
  color: grey;
  font-size: 23px;
  position: relative;
  left: 3px;
  z-index: 3;
`;
const InVisibleMe = styled(AiFillEyeInvisible)`
  color: grey;
  font-size: 23px;
  position: relative;
  z-index: 3;
  left: 3px;
`;
