import { Title } from 'components/DropDownList/AnimatedDropDownList.style';
import Heading from 'components/Heading/Heading';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import setEmailAction from 'store/actions/auth/setEmailAction';
import loginAction from 'store/actions/auth/loginAction';
import setPasswordAction from 'store/actions/auth/setPassAction';
import setLoginRouteAction from 'store/actions/auth/setLoginRouteAction';
import InvisibleIcon from 'components/Icons/InVisible';
import VisibleIcon from 'components/Icons/VisibleIcon';
import Button from 'components/Buttons/Button';
import { FORGOT_PASSWORD } from 'const/LoginRoutes';
import LastLoginsModal from '../elements/LastLoginsModal';
import ContinueWithGoogle from '../elements/ContinueWithGoogle';
import CreateAccountButton from '../elements/CreateAccountButton';

const { RVDic } = window;

const SignIn = () => {
  const dispatch = useDispatch();

  const [passVisible, setPassVisible] = useState(false);

  const {
    email,
    emailError,
    password,
    passwordError,
    isFetching,
  } = useSelector((state) => ({
    email: state.auth.email,
    emailError: state.auth.emailError,
    password: state.auth.password,
    passwordError: state.auth.passwordError,
    isFetching: state.auth.isFetching,
  }));

  const onEmailChanged = (value) => {
    dispatch(setEmailAction(value));
  };
  const onPasswordChanged = (value) => {
    dispatch(setPasswordAction(value));
  };
  const onClick = () => {
    dispatch(loginAction({ email: email, password: password }));
  };
  const onForgot = () => {
    dispatch(setLoginRouteAction(FORGOT_PASSWORD));
  };

  return (
    <Container>
      <Heading
        type="h5"
        style={{
          marginTop: '2rem',
          marginBottom: '2rem',
          textAlign: 'center',
        }}>
        {RVDic.SignUp}
      </Heading>
      <AnimatedInput
        onChange={onEmailChanged}
        value={email}
        placeholder={RVDic.EmailAddress}
        error={emailError}
        shake={emailError}
        style={{ marginTop: '1rem', marginBottom: '1rem' }}
      />
      <AnimatedInput
        onChange={onPasswordChanged}
        value={password}
        placeholder={RVDic.Password}
        type={passVisible ? 'text' : 'password'}
        error={passwordError}
        shake={passwordError}
        style={{ marginTop: '1rem', marginBottom: '1rem' }}
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
      <Button
        type="secondary-o"
        style={{ fontSize: '1rem' }}
        className="rv-red"
        style={{
          width: '100%',
          textAlign: 'center',
          marginBottom: '1rem',
          marginTop: '1rem',
        }}
        onClick={onForgot}>
        {RVDic.ForgotMyPassword}
      </Button>
      <Button
        onClick={onClick}
        type="primary"
        loading={isFetching}
        style={{
          width: '100%',
          textAlign: 'center',
          marginBottom: '1rem',
          marginTop: '1rem',
        }}>
        {RVDic.Login}
      </Button>
      <ContinueWithGoogle
        style={{
          marginBottom: '1rem',
          marginTop: '1rem',
        }}
      />
      <CreateAccountButton
        style={{
          marginBottom: '1rem',
          marginTop: '1rem',
        }}
      />

      <LastLoginsModal />
    </Container>
  );
};
export default SignIn;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
`;
