/**
 * An input component that animates placeholder position
 */
import InVisibleIcon from 'components/Icons/InVisible';
import VisibleIcon from 'components/Icons/VisibleIcon';
import { MAIN_BLUE } from 'const/Colors';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const { RV_Float, RV_RevFloat } = window;

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
  useEffect(() => {
    console.log(window, 'focused input');
  }, [inputFocused]);
  return (
    <Container error={error} style={style} inputFocused={inputFocused}>
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
          onBlur={(e) => {
            console.log('blurred');
            e.preventDefault();
            setFocused(false);
          }}
          onChange={(event) => {
            console.log(event.target.value, 'on event');

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
  width: 100%;
  align-self: center;
  flex-direction: row;
  border: ${({ error, inputFocused }) =>
    error
      ? 'solid 0.5px red'
      : inputFocused
      ? `solid 1px ${MAIN_BLUE}`
      : 'solid 0.5px #bac9dc'};
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
  display: flex;
  width: 100%;
  outline: none;
  padding: 11px 7px 10px 11px;
  color: #2c3235;
  letter-spacing: 0.2px;
  font-weight: 400;
  font-size: 16px;
  resize: none;
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;
  text-align: ${RV_Float};
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
  background-color: ${({ inputFocused }) =>
    inputFocused ? `white` : 'rgba(0,0,0,0)'};
  ${({ inputFocused }) =>
    inputFocused ? `${RV_Float}: 10px` : `${RV_Float}: 0px`};
  top: ${({ inputFocused }) => (inputFocused ? `0px` : `50%`)};

  color: ${({ inputFocused, value }) =>
    inputFocused ? `black` : value.length > 0 ? 'rgba(0,0,0,0)' : `#707070`};
  font-size: ${({ inputFocused }) => (inputFocused ? `11px` : `16px`)};
`;
const Error = styled.span`
  color: red;
  font-size: 23px;
  margin-left: 13px;
  position: relative;
  left: 13px;
`;
const VisibleMe = styled(VisibleIcon)`
  color: grey;
  font-size: 23px;
  position: relative;
  left: 7px;
  z-index: 3;
`;
const InVisibleMe = styled(InVisibleIcon)`
  color: grey;
  font-size: 23px;
  position: relative;
  z-index: 3;
  left: 7px;
`;
