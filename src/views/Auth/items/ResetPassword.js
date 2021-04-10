import Button from 'components/Buttons/Button';
import Heading from 'components/Heading/Heading';
import Edit from 'components/Icons/Edit';
import InvisibleIcon from 'components/Icons/InVisible';
import VisibleIcon from 'components/Icons/VisibleIcon';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import { MAIN_BLUE } from 'const/Colors';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import setPasswordAction from 'store/actions/auth/setPassAction';
import styled from 'styled-components';
import { Box } from '../AuthView.style';
import PasswordValidation from '../elements/PasswordValidation';

const { RVDic } = window;

const ResetPassword = () => {
  const dispatch = useDispatch();
  const { goBack, push } = useHistory();
  const passRef = useRef();

  //If true, the typed password will be shown.
  const [passVisible, setPassVisible] = useState(false);
  //If true, means the password input is focused(to showing the Password validation).
  const [passFocused, setPassFocused] = useState(false);

  const {
    email,
    isFetching,
    verifyCodeToken,
    verifyCode,
    verifyCodeError,
    verifyCodeLength,
    password,
    passwordError,
  } = useSelector((state) => ({
    email: state.auth.email,
    password: state.auth.password,
    emailError: state.auth.emailError,
    password: state.auth.password,
    passwordError: state.auth.passwordError,
    isFetching: state.auth.isFetching,
    fetchingFiles: state.auth.fetchingFiles,
    routeHistory: state.auth.routeHistory,
    passwordPolicy: state.auth.passwordPolicy,
    lastLoginModal: state.auth.lastLoginModal,
    verifyCodeToken: state.auth.verifyCodeToken,
    verifyCode: state.auth.verifyCode,
    verifyCodeError: state.auth.verifyCodeError,
    verifyCodeLength: state.auth.verifyCodeLength,
    passwordError: state.auth.passwordError,
  }));

  /**
   * Synchronously sets inputted password to redux state.
   * @param {String} value - password input
   */
  const onPasswordChanged = (value) => {
    dispatch(setPasswordAction(value));
  };
  /**
   * When the password input is focused, the password validator will be shown.
   */
  const onPassFocus = () => {
    setPassFocused(true);
  };
  /**
   * When the password input is blurred, the Clickmind terms will be shown.
   */
  const onPassBlur = () => {
    setTimeout(() => {
      setPassFocused(false);
    }, 100);
  };
  /**
   * When the user is typing in password input and then presses the enter key,
   * 'onSignUp' will fire.
   */
  const onPassEnter = () => {};
  const onChangePassword = () => {};

  return (
    <Box>
      <Container>
        <Heading
          type="h5"
          style={{
            textAlign: 'center',
            ...common_style,
          }}>
          {RVDic.Login}
        </Heading>
        <RowItems style={common_style}>
          <Heading
            type="h1"
            style={{
              textAlign: 'center',
              ...common_style,
            }}
            className={'rv-distant'}>
            {email}
          </Heading>
          <Edit
            style={{ fontSize: '1.5rem', color: MAIN_BLUE }}
            onClick={goBack}
          />
        </RowItems>
        <AnimatedInput
          onChange={onPasswordChanged}
          value={password}
          placeholder={RVDic.Password}
          type={passVisible ? 'text' : 'password'}
          error={passwordError}
          shake={passwordError && 300}
          style={common_style}
          id={'password'}
          ref={passRef}
          onBlur={onPassBlur}
          onFocus={onPassFocus}
          enterListener={onPassEnter}
        />
        <AnimatedInput
          onChange={onPasswordChanged}
          value={password}
          placeholder={RVDic.Password}
          type={passVisible ? 'text' : 'password'}
          error={passwordError}
          shake={passwordError && 300}
          style={common_style}
          id={'password'}
          ref={passRef}
          onBlur={onPassBlur}
          onFocus={onPassFocus}
          enterListener={onPassEnter}
          children={
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
          }
        />
        <PasswordValidation
          style={{
            opacity: '0',
            transition: 'opacity 1s',
          }}
          isVisible={passFocused}
        />
        <Button
          type="primary"
          style={{ fontSize: '1rem' }}
          style={{ width: '100%' }}
          style={common_style}
          onClick={onChangePassword}>
          {RVDic.ChangePassword}
        </Button>
      </Container>
    </Box>
  );
};
export default ResetPassword;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  height: 100%;
  justify-content: space-between;
`;
const RowItems = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: center;
  justify-content: space-between;
  width: 100%;
`;
const common_style = {
  marginBottom: '1rem',
  marginTop: '1rem',
};
