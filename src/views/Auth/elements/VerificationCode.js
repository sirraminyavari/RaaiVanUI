/**
 * A component for rendering single cell for each code input char
 */
import { LIGHT_BLUE, RED } from 'const/Colors';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ShakeAnimate } from './Animate.style';

const { RV_Float } = window;

const VerificationCode = ({
  error,
  value,
  length,
  onValueChange,
  ...props
}) => {
  // Index of next char
  const [ind, setIndex] = useState(0);
  // verification code input UI is designed to every char has its cell.
  //so verification code stores as an array and finally will convert to string
  const [inputArray, setInputArray] = useState([]);

  // According to verifyCodeLength:
  // Creates an array of '-1' for verification code array.
  useEffect(() => {
    let activationCodeArray = [];
    for (let i = 0; i < length; i++) {
      activationCodeArray.push(-1);
    }
    setInputArray(activationCodeArray);
  }, [length]);

  /**
   * By typing or deleting,
   * focus of verification-code cell will change.
   */
  const VerifyCodeInputProducer = () => {
    const itemsRef = useRef([]);

    useEffect(() => {
      itemsRef.current[ind]?.focus();
    }, [value, ind]);

    // according to input array length, produces cells with help of 'map'.
    return (
      <Maintainer>
        {inputArray.map((value, index) => {
          itemsRef.current = itemsRef.current.slice(0, 6);
          /**
           * According to user is typing or deleting,
           * this method decides to change the focus forward or backward.
           * @param {HTMLInputElement} e - user inputs
           */
          const OnChange = (e) => {
            const input = e.target.value;
            // Detects user is deleting
            if (input === '') {
              let pre = inputArray;
              pre[index] = -1;
              setInputArray(pre);
              // dispatch(setVerifyCodeAction(pre));
              onValueChange(pre);
              setIndex(index - 1);
            }
            // Detects user is typing
            else {
              let pre = inputArray;
              pre[index] = input;
              setInputArray(pre);
              // dispatch(setVerifyCodeAction(pre));
              onValueChange(pre);

              setIndex(index + 1);
            }
          };

          return (
            <InputChar
              key={index}
              type={'text'}
              maxLength="1"
              value={inputArray[index] !== -1 ? inputArray[index] : ''}
              onChange={OnChange}
              width={100 / inputArray.length + '%'}
              ref={(el) => (itemsRef.current[index] = el)}
              error={error}
            />
          );
        })}
      </Maintainer>
    );
  };

  return (
    <Container {...props}>
      <ShakeAnimate isVisible={error}>
        {inputArray?.length > 0 && <VerifyCodeInputProducer />}
      </ShakeAnimate>
      <ErrorMessage error={error}>{error}</ErrorMessage>
    </Container>
  );
};
export default VerificationCode;

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  flex-direction: column;
`;

const InputChar = styled.input`
  display: flex;

  border-width: 1px;
  border-color: ${({ error }) => (error ? RED : LIGHT_BLUE)};
  border-style: solid;
  border-radius: 7px;
  background-color: white;
  width: ${({ width }) => width};
  height: 4rem;
  margin: 5px;
  text-align: center;
`;
const ErrorMessage = styled.div`
  color: ${RED};
  text-align: ${RV_Float};
  font-size: 0.7rem;
  margin-top: 3px;
  opacity: ${({ error }) => (error ? 1 : 0)};
  max-height: ${({ error }) => (error ? '5rem' : 0)};
  min-height: ${({ error }) => (error ? '0rem' : '0rem')};
  transition: max-height 1s, opacity 1s, min-height 1s;
`;
const Maintainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;
