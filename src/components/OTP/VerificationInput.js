/**
 * A component for rendering single cell for each code input char
 */
import Input from 'components/Inputs/Input';
import { LIGHT_BLUE, RED } from 'constant/Colors';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const { RV_Float } = window;

const VerificationInput = ({
  error,
  shake,
  value,
  length,
  onValueChange,
  size,
  reset,
  ...props
}) => {
  // Index of next char
  const [ind, setIndex] = useState(0);

  // verification code input UI is designed to every char has its cell.
  //so verification code stores as an array and finally will convert to string
  const [inputArray, setInputArray] = useState([]);

  const [doShake, setDoShake] = useState(shake);

  useEffect(() => {
    setDoShake(shake);
    let to = setTimeout(() => setDoShake(0), 1000);
    return () => clearTimeout(to);
  }, [shake]);

  useEffect(() => {
    setInputArray([...Array(length).keys()].map((i) => -1));
    setIndex(0);
  }, [reset]);

  // According to verifyCodeLength:
  // Creates an array of '-1' for verification code array.
  useEffect(() => {
    setInputArray([...Array(length).keys()].map((i) => -1));
  }, [length]);

  /**
   * By typing or deleting,
   * focus of verification-code cell will change.
   */
  const VerifyCodeInputProducer = () => {
    const itemsRef = useRef([]);

    useEffect(() => {
      itemsRef.current[ind]?.focus();
      itemsRef.current[ind]?.select();
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
          const handleKeyUp = (e) => {
            const val = e.key;
            let pre = inputArray;

            if (String(e.key).toLowerCase() === 'backspace') {
              pre[index] = -1;
              setInputArray(pre);
              onValueChange(pre, { lastChangedIndex: index });
              setIndex(Math.max(index - 1, 0));
            } else if (String(e.key).toLowerCase() === 'arrowleft')
              setIndex(Math.max(index - 1, 0));
            else if (String(e.key).toLowerCase() === 'arrowright')
              setIndex(Math.min(index + 1, length - 1));
            else if (+val >= 0) {
              pre[index] = +val;
              setInputArray(pre);
              onValueChange(pre, { lastChangedIndex: index });
              setIndex(index + 1);
            }
          };

          return (
            <InputChar
              key={index}
              type={'text'}
              maxLength="1"
              size={size}
              value={inputArray[index] !== -1 ? inputArray[index] : ''}
              onKeyUp={handleKeyUp}
              onFocus={(e) => setIndex(index)}
              width={100 / inputArray.length + '%'}
              ref={(el) => (itemsRef.current[index] = el)}
              onChange={() => {}}
              error={!!error}
              shake={doShake}
            />
          );
        })}
      </Maintainer>
    );
  };

  return (
    <Container {...props}>
      {inputArray?.length > 0 && <VerifyCodeInputProducer />}
      {<ErrorMessage error={error}>{error}</ErrorMessage>}
    </Container>
  );
};

export default VerificationInput;

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const InputChar = styled(Input)`
  display: flex;

  border-width: 1px;
  border-color: ${({ error }) => (error ? RED : LIGHT_BLUE)};
  border-style: solid;
  border-radius: 7px;
  background-color: white;
  width: ${({ size }) => size || 3}rem;
  height: ${({ size }) => size || 3}rem;
  margin: 5px;
  text-align: center;
`;

const ErrorMessage = styled.div`
  color: ${RED};
  text-align: ${RV_Float};
  font-size: 0.7rem;
  margin-top: 3px;
  margin: 5px;
  opacity: ${({ error }) => (error ? 1 : 0)};
  max-height: ${({ error }) => (error ? '5rem' : 0)};
  min-height: ${({ error }) => (error ? '0rem' : '0rem')};
  transition: max-height 1s, opacity 1s, min-height 1s;
`;

const Maintainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
  width: 100%;
  align-items: center;
  justify-content: center;
  direction: rtl;
`;
