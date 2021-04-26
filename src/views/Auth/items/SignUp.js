/**
 *  Sign up page
 */
import Button from 'components/Buttons/Button';
import Heading from 'components/Heading/Heading';
import InvisibleIcon from 'components/Icons/InVisible';
import LoadingIconFlat from 'components/Icons/LoadingIcons/LoadingIconFlat';
import VisibleIcon from 'components/Icons/VisibleIcon';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import { LIGHT_BLUE } from 'const/Colors';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import sendVerifyCodeAction from 'store/actions/auth/sendVerifyCodeAction';
import setCaptchaTokenAction from 'store/actions/auth/setCaptchaToken';
import setEmailAction from 'store/actions/auth/setEmailAction';
import setFamilyAction from 'store/actions/auth/setFamilyAction';
import setNameAction from 'store/actions/auth/setNameAction';
import setPasswordAction from 'store/actions/auth/setPassAction';
import signupLoadFilesAction from 'store/actions/auth/signupLoadFilesAction';
import styled from 'styled-components';
import ContinueWithGoogle from '../elements/ContinueWithGoogle';
import PasswordValidation from '../elements/PasswordValidation';
import { decode } from 'js-base64';
import { Box } from '../AuthView.style';
import setLoginRouteAction from 'store/actions/auth/setLoginRouteAction';

const { RVDic, RVGlobal } = window;
/**
 * In this page user can create an account with his/her mobile/email.
 */
const SignUp = () => {
  const splitted_terms = RVDic.Checks.YouMustAgreeWithTermsAndConditions.split(
    '[m]'
  );

  // To handle inputs focus
  const emailRef = useRef();
  const passRef = useRef();
  const nameRef = useRef();
  const familyRef = useRef();

  const dispatch = useDispatch();
  const { push } = useHistory();

  //If true, the typed password will be shown.
  const [passVisible, setPassVisible] = useState(false);
  //If true, means the password input is focused(to showing the Password validation).
  const [passFocused, setPassFocused] = useState(false);
  // Routing is handled with the 'useEffect'. to prevent unwanted navigation,
  // sign up button have to  be clicked
  const [signUpClicked, setSignUpClicked] = useState(false);

  const {
    email,
    emailError,
    password,
    passwordError,
    isFetching,
    fetchingFiles,
    passwordPolicy,
    name,
    nameError,
    family,
    familyError,
    routeHistory,
  } = useSelector((state) => ({
    email: state.auth.email,
    emailError: state.auth.emailError,
    password: state.auth.password,
    passwordError: state.auth.passwordError,
    name: state.auth.name,
    nameError: state.auth.nameError,
    family: state.auth.family,
    familyError: state.auth.familyError,
    isFetching: state.auth.isFetching,
    fetchingFiles: state.auth.fetchingFiles,
    passwordPolicy: state.auth.passwordPolicy,
    routeHistory: state.auth.routeHistory,
  }));

  // has two responsibilities.
  // 1- when the component did mount, checks password policy, if it is null, will fetch it.
  // 2- when component will unmount, sets signUpClicked to false.
  useEffect(() => {
    const { GlobalUtilities } = window;

    !passwordPolicy && dispatch(signupLoadFilesAction());
    GlobalUtilities.init_recaptcha((captcha) => {
      captcha.getToken((token) => {
        //use token
        dispatch(setCaptchaTokenAction(token));
      });
    });
    return () => {
      setSignUpClicked(false);
      dispatch(setLoginRouteAction(null));
    };
  }, []);
  // By changing routeHistory & signUpClicked,
  // navigates to the address that routeHistory says.
  useEffect(() => {
    signUpClicked && routeHistory && !isFetching && push(routeHistory);
  }, [routeHistory, signUpClicked, isFetching]);

  /**
   * Synchronously sets inputted email/number to redux state.
   * @param {String} value - email input
   */
  const onEmailChanged = (value) => {
    dispatch(setEmailAction(value));
  };
  /**
   * Synchronously sets inputted password to redux state.
   * @param {String} value - password input
   */
  const onPasswordChanged = (value) => {
    dispatch(setPasswordAction(value));
    setPassFocused(true);
  };
  /**
   * Synchronously sets inputted name to redux state.
   * @param {String} value - name input
   */
  const onNameChanged = (value) => {
    dispatch(setNameAction(value));
  };
  /**
   * Synchronously sets inputted family to redux state.
   * @param {String} value - family input
   */
  const onFamilyChanged = (value) => {
    dispatch(setFamilyAction(value));
  };
  /**
   * When the user is typing in email input and then presses the enter key,
   * focus will change to name input
   */
  const onEmailEnter = () => {
    passRef.current?.focus();
  };
  /**
   * When the user is typing in name input and then presses the enter key,
   * focus will change to family input
   */
  const onNameEnter = () => {
    familyRef.current?.focus();
  };
  /**
   * When the user is typing in family input and then presses the enter key,
   * focus will change to password input
   */
  const onFamilyEnter = () => {
    onSendVerifyCode();
  };
  /**
   * When the user is typing in password input and then presses the enter key,
   * 'onSignUp' will fire.
   */
  const onPassEnter = () => {
    nameRef.current?.focus();
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
   *  Starts the process of registering the user by sending a verification code.
   */
  const onSendVerifyCode = () => {
    setSignUpClicked(true);
    dispatch(
      sendVerifyCodeAction({
        email,
        password,
        name,
        family,
        passwordPolicy,
      })
    );
  };
  /**
   * Returns user to the login page.
   */
  const onHaveAccount = () => {
    dispatch(setEmailAction(''));
    dispatch(setPasswordAction(''));
    push('/auth/login');
  };

  const passVisibility = (value) => {
    setPassVisible(value);
    setTimeout(() => {
      setPassFocused(true);
    }, 101);
  };

  return (
    <Box>
      {fetchingFiles ? (
        <LoadingIconFlat style={{ height: '50vh' }} />
      ) : (
        <Container>
          <Heading
            type="h5"
            style={{
              marginTop: '2rem',
              marginBottom: '2rem',
              textAlign: 'center',
            }}
            className={'rv-distant'}>
            {RVDic.CreateAccount}
          </Heading>

          <AnimatedInput
            onChange={onEmailChanged}
            value={email}
            placeholder={RVDic.EmailAddress}
            error={emailError}
            shake={emailError && 300}
            style={common_style}
            id={'email'}
            ref={emailRef}
            enterListener={onEmailEnter}
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
                  onClick={() => passVisibility(false)}
                />
              ) : (
                <VisibleIcon
                  className="rv-gray"
                  style={{ cursor: 'pointer' }}
                  onClick={() => passVisibility(true)}
                />
              )
            }
          />
          {passFocused && (
            <PasswordValidation
              style={{
                opacity: '0',
                transition: 'opacity 1s',
              }}
              isVisible={passFocused}
              password={password}
              passwordPolicy={passwordPolicy}
            />
          )}

          <RowItems>
            <AnimatedInput
              onChange={onNameChanged}
              value={name}
              placeholder={RVDic.Name}
              error={nameError}
              shake={nameError && 300}
              style={{ marginLeft: '1rem', ...common_style }}
              id={'name'}
              ref={nameRef}
              enterListener={onNameEnter}
            />
            <AnimatedInput
              onChange={onFamilyChanged}
              value={family}
              placeholder={RVDic.LastName}
              error={familyError}
              style={{ marginRight: '1rem', ...common_style }}
              shake={familyError && 300}
              style={common_style}
              id={'family'}
              ref={familyRef}
              enterListener={onFamilyEnter}
            />
          </RowItems>
          {!passFocused && (
            <Heading
              type="h6"
              style={{
                fontSize: '0.8rem',
                opacity: `${passFocused ? 0 : 1}`,
                transition: 'opacity 1s',
                marginTop: '1rem',
                marginBottom: '2.5rem',
              }}>
              {/* <p>
                {'با ثبت ایمیل در کلیک مایند، شما میپذیرید که '}
                <a
                  href="http://www.cliqmind.com/%D9%82%D9%88%D8%A7%D9%86%DB%8C%D9%86-%D9%88-%D8%AA%D8%B9%D9%87%D8%AF%D8%A7%D8%AA/"
                  target="_blank"
                  style={{ color: 'blue' }}>
                  {'قوانین کلیک مایند'}
                </a>
                {' را خوانده و به آن متعهد هستید '}
              </p> */}
              {/* {decode(RVGlobal.SystemName)} */}
              {splitted_terms[0].replace('[n]', decode(RVGlobal.SystemName))}
              <a
                href="http://www.cliqmind.com/%D9%82%D9%88%D8%A7%D9%86%DB%8C%D9%86-%D9%88-%D8%AA%D8%B9%D9%87%D8%AF%D8%A7%D8%AA/"
                target="_blank"
                style={{ color: 'blue' }}>
                {decode(RVGlobal.SystemName)}
              </a>
              {splitted_terms[1].replace('[m]', '')}
            </Heading>
          )}
          <Button
            onClick={onSendVerifyCode}
            type="primary"
            loading={isFetching}
            disable={!email || !password || !name || !family}
            style={{
              width: '100%',
              textAlign: 'center',
              ...common_style,
              marginBottom: '2.5rem',
            }}>
            {RVDic.GetConfirmationCode}
          </Button>
          <Hiddener isVisible={email.length === 0}>
            <ContinueWithGoogle style={{ width: '100%', common_style }} />
            <Button
              type="secondary-o"
              style={{ fontSize: '1rem' }}
              style={{ width: '100%' }}
              style={common_style}
              onClick={onHaveAccount}>
              {RVDic.AlreadyHaveAnAccount}
            </Button>
          </Hiddener>
        </Container>
      )}
    </Box>
  );
};
export default SignUp;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80%;
  height: 100%;
`;
const RowItems = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
const common_style = {
  marginBottom: '0.75rem',
  marginTop: '0.75rem',
  fontSize: '0.8rem',
};
const Hiddener = styled.div`
  width: 100%;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  ${({ isVisible }) => (isVisible ? `max-height:100rem` : `max-height:0rem`)};
  transition: opacity 0.7s, max-height 1s;
`;
