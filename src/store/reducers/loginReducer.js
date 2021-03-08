import { createSlice } from '@reduxjs/toolkit';
import {
  RESET_PASSWORD_SENT,
  SIGN_IN,
  SIGN_UP_EMAIL,
  SIGN_UP_PASSWORD,
  SIGN_UP_SUCCESS,
  VERIFICATION_CODE,
} from 'const/LoginRoutes';

const { GlobalUtilities, IsAuthenticated } = window;
export const loginSlice = createSlice({
  name: 'auth',

  initialState: {
    isFetching: false,
    auth: null,
    email: '',
    password: '',
    orgDomains: [],
    selectedDomain: null,
    name: '',
    family: '',
    verifyCode: null,
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
    routeHistory: null,
    isPasswordFocused: false,
    resendVerifyCodeIsFetching: false,
    resendVerifyCodeTimeout: null,
    resendVerifyCodeTotalTimeout: null,
    resendVerifyCodeToken: null,
    isAuthenticated: IsAuthenticated,
    lastLoginModal: false,
    lastLogins: null,
    lastLoginMessage: null,
    captchaToken: null,
    //
    Objects: {
      IsInvited: null,
      Captcha: null,
      InvitationID: GlobalUtilities.request_params().get_value('inv'),
    },
    Options: {
      UseCaptcha: null,
      Title: null,
      ReloadAfterLogin: null,
      ReturnURL: null,
      IgnoreSSO: null,
    },
  },
  reducers: {
    loginStart: (state, action) => {
      state.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.auth = action.payload;
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
      state.routeHistory = 'verificationCode';
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
      // state.auth = action.payload;
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
      state.routeHistory = '/register';
      state.passwordPolicy = action.payload;
    },
    signupLoadFilesFailed: (state, action) => {
      state.fetchingFiles = false;
    },
    logoutSuccess: (state, action) => {
      state.isAuthenticated = false;
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
    setOrgDomainsError: (state, action) => {
      state.orgDomainsError = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
      state.nameError = null;
    },
    setSelectedOrgDomain: (state, action) => {
      state.selectedDomain = action.payload;
      state.orgDomainsError = null;
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
    resetAllInputs: (state, action) => {
      state.password = '';
      state.verifyCode = '';
      state.email = '';
      state.name = '';
      state.family = '';
      state.selectedDomain = null;
    },
    showLastLogins: (state, action) => {
      state.lastLoginModal = true;
      state.lastLoginMessage = action.payload.message;
      state.lastLogins = action.payload.lastLogins;
    },
    setCaptchaToken: (state, action) => {
      state.captchaToken = action.payload;
    },
    setIsAthunticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export default loginSlice.reducer;
