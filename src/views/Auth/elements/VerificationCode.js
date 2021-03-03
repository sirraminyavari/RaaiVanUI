/**
 * A component for rendering single cell for each code input char
 */
import { LIGHT_BLUE, RED } from 'const/Colors';
import { VERIFICATION_CODE } from 'const/LoginRoutes';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import setVerifyCodeAction from 'store/actions/auth/setVerifyCode';
import styled from 'styled-components';
import { ShakeAnimate, UpToDownAnimate } from './Animate.style';

const { RV_Float } = window;

const VerificationCode = () => {
  const dispatch = useDispatch();
  // We use ref to pass component dimensions to 'UpToDownAnimate'
  const ref = useRef();
  // Index of next char
  const [ind, setIndex] = useState(0);
  // verification code input UI is designed to every char has its cell.
  //so verification code stores as an array and finally will convert to string
  const [inputArray, setInputArray] = useState([]);

  const {
    currentRoute,
    verifyCode,
    verifyCodeError,
    verifyCodeLength,
  } = useSelector((state) => ({
    currentRoute: state.auth.currentRoute,
    verifyCode: state.auth.verifyCode,
    verifyCodeError: state.auth.verifyCodeError,
    verifyCodeLength: state.auth.verifyCodeLength,
  }));
  // According to verifyCodeLength:
  // Creates an array of '-1' for verification code array.
  useEffect(() => {
    let activationCodeArray = [];
    for (let i = 0; i < verifyCodeLength; i++) {
      activationCodeArray.push(-1);
    }
    setInputArray(activationCodeArray);
  }, [verifyCodeLength]);

  // useEffect(() => {
  //   let activationCodeArray = [];
  //   for (let i = 0; i < codeLength; i++) {
  //     activationCodeArray.push(-1);
  //   }
  //   setInputArray(activationCodeArray);
  // }, [verifyCodeError]);

  /**
   * According to 'currentRoute'
   * this function decides to return true or false.
   */
  const isVisible = () => {
    switch (currentRoute) {
      case VERIFICATION_CODE:
        return true;
      default:
        return false;
    }
  };
  /**
   * By typing or deleting,
   * focus of verification-code cell will change.
   */
  const VerifyCodeInputProducer = () => {
    const itemsRef = useRef([]);
    useEffect(() => {
      itemsRef.current[ind]?.focus();
    }, [verifyCode, ind]);
    // according to input array length, produces cells with help of 'map'.
    return inputArray.map((value, index) => {
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
          dispatch(setVerifyCodeAction(pre));
          setIndex(index - 1);
        }
        // Detects user is typing
        else {
          let pre = inputArray;
          pre[index] = input;
          setInputArray(pre);
          dispatch(setVerifyCodeAction(pre));
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
          error={verifyCodeError}
        />
      );
    });
  };

  return (
    <UpToDownAnimate
      ref={ref}
      dimension={ref?.current?.getBoundingClientRect()}
      isVisible={isVisible()}
      style={{ marginTop: '2rem' }}>
      <Container>
        <ShakeAnimate isVisible={verifyCodeError}>
          {inputArray?.length > 0 && isVisible() && <VerifyCodeInputProducer />}
        </ShakeAnimate>

        <ErrorMessage error={verifyCodeError}>{verifyCodeError}</ErrorMessage>
      </Container>
    </UpToDownAnimate>
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
  height: 3.2rem;
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
