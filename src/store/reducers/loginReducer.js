import { createSlice } from '@reduxjs/toolkit';
import {
  RESET_PASSWORD_SENT,
  SIGN_IN,
  SIGN_UP_EMAIL,
  SIGN_UP_PASSWORD,
  SIGN_UP_SUCCESS,
  VERIFICATION_CODE,
} from 'const/LoginRoutes';

export const loginSlice = createSlice({
  name: 'auth',

  initialState: {
    isFetching: false,
    login: null,
    email: '',
    password: '',
    orgDomains: [],
    name: '',
    family: '',
    verifyCode: [],
    verifyCodeLength: 0,
    verifyCodeToken: null,
    verifyCodeError: null,
    wrongCode: false,
    passwordError: null,
    emailError: null,
    nameError: null,
    familyError: null,
    orgDomainsError: null,
    currentRoute: SIGN_IN,
    passwordPolicy: null,
    fetchingFiles: false,
    isPasswordFocused: false,
    resendVerifyCodeIsFetching: false,
    resendVerifyCodeTimeout: null,
    resendVerifyCodeTotalTimeout: null,
    resendVerifyCodeToken: null,
  },
  reducers: {
    login: (state, action) => {
      state.isFetching = true;
    },
    loginResult: (state, action) => {
      state.login = action.payload;
      state.isFetching = false;
    },
    loginFailed: (state, action) => {
      state.error = action.payload;
      state.isFetching = false;
      state.emailError = action.payload;
      state.passwordError = action.payload;
    },
    sendVerifyCode: (state, action) => {
      state.isFetching = true;
    },
    sendVerifyCodeSuccess: (state, action) => {
      console.log(action.payload, 'payload payload');
      state.verifyCodeLength = action.payload?.VerificationCode.Length;
      state.resendVerifyCodeTimeout = action.payload.VerificationCode.Timeout;
      state.resendVerifyCodeTotalTimeout =
        action.payload.VerificationCode.TotalTimeout;
      state.isFetching = false;
      state.verifyCodeToken = action.payload.VerificationCode.Token;
      state.resendVerifyCodeToken = action.payload.VerificationCode.Token;
      state.currentRoute = VERIFICATION_CODE;
    },
    sendVerifyCodeFailed: (state, action) => {
      state.isFetching = false;
      state.verifyCodeError = action.payload;
    },
    reSendVerifyCode: (state, action) => {
      state.resendVerifyCodeIsFetching = true;
    },
    reSendVerifyCodeSuccess: (state, action) => {
      console.log(action, 'resend success');
      state.resendVerifyCodeIsFetching = false;
      state.verifyCodeToken = action.payload.AccessToken;
      state.resendVerifyCodeTotalTimeout =
        state.resendVerifyCodeTotalTimeout - state.resendVerifyCodeTimeout;
    },
    reSendVerifyCodeFailed: (state, action) => {
      state.resendVerifyCodeIsFetching = false;
      state.resendVerifyCodeTimeout = 0;
    },
    verification: (state, action) => {
      state.isFetching = true;
    },
    verificationResult: (state, action) => {
      // state.login = action.payload;
      state.isFetching = false;
    },
    verificationFailed: (state, action) => {
      // state.error = action.payload;
      state.isFetching = false;
    },
    signup: (state, action) => {
      state.isFetching = true;
    },
    signupSuccess: (state, action) => {
      state.isFetching = false;
      state.currentRoute = SIGN_UP_SUCCESS;
      state.password = '';
      state.email = '';
    },
    signupFailed: (state, action) => {
      state.isFetching = false;
    },
    sendResetPasswordLink: (state, action) => {
      state.isFetching = true;
    },
    sendResetPasswordLinkSuccess: (state, action) => {
      state.isFetching = false;
      state.currentRoute = RESET_PASSWORD_SENT;
    },
    sendResetPasswordLinkFailed: (state, action) => {
      state.isFetching = false;
    },
    signupLoadFiles: (state, action) => {
      state.fetchingFiles = true;
    },
    signupLoadFilesSuccess: (state, action) => {
      state.fetchingFiles = false;
      state.passwordPolicy = action.payload;
      state.currentRoute = SIGN_UP_EMAIL;
    },
    signupLoadFilesFailed: (state, action) => {
      state.fetchingFiles = false;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
      state.emailError = null;
    },
    setEmailError: (state, action) => {
      state.emailError = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
      state.passwordError = null;
    },
    setPasswordError: (state, action) => {
      state.passwordError = action.payload;
    },
    setOrgDomains: (state, action) => {
      state.orgDomains = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
      state.nameError = null;
    },
    setNameError: (state, action) => {
      state.nameError = action.payload;
    },
    setFamily: (state, action) => {
      state.family = action.payload;
      state.familyError = null;
    },
    setFamilyError: (state, action) => {
      state.familyError = action.payload;
    },
    setVerifyCode: (state, action) => {
      let preState = [];
      for (let i = 0; i < action.payload.new.length; i++) {
        preState.push(action.payload.new[i]);
      }

      state.verifyCode = preState;
      state.verifyCodeError = null;
    },
    setVerifyCodeError: (state, action) => {
      state.verifyCodeError = action.payload;
    },
    setLoginRoute: (state, action) => {
      state.currentRoute = action.payload;
    },
    setPasswordFocus: (state, action) => {
      state.isPasswordFocused = action.payload;
    },
    resetAllErrors: (state, action) => {
      state.passwordError = null;
      state.verifyCodeError = null;
      state.emailError = null;
      state.nameError = null;
      state.familyError = null;
      state.orgDomainsError = null;
    },
  },
});

export default loginSlice.reducer;
