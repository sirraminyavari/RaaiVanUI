import { createSlice } from '@reduxjs/toolkit';
import { SIGN_IN } from 'constant/LoginRoutes';

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
      InvitationID: GlobalUtilities?.request_params().get_value('inv'),
    },
    Options: {
      UseCaptcha: null,
      Title: null,
      ReloadAfterLogin: null,
      ReturnURL: null,
      IgnoreSSO: null,
    },
    resetPasswordAddress: {
      email: null,
      phone: null,
    },
    authUser: window.RVGlobal?.CurrentUser || null,
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
    },
    sendResetPasswordLinkFailed: (state, action) => {
      state.isFetching = false;
    },
    sendResetPasswordTicket: (state, action) => {
      state.isFetching = true;
    },
    sendResetPasswordTicketSuccessAddress: (state, action) => {
      state.isFetching = false;
      state.routeHistory = action.payload.route;
      state.resetPasswordAddress = action.payload?.address && {
        email: 'aligol20@gmail.com',
        phone: '09185409343',
      };
    },
    sendResetPasswordTicketSuccessVerification: (state, action) => {
      console.log(action.payload, 'payload payload');

      state.verifyCodeLength =
        action.payload?.VerificationCode.VerificationCode.Length;
      state.resendVerifyCodeTimeout =
        action.payload.VerificationCode.VerificationCode.Timeout;
      state.resendVerifyCodeTotalTimeout =
        action.payload.VerificationCode.VerificationCode.TotalTimeout;
      state.isFetching = false;
      state.routeHistory = action.payload.route;
      state.verifyCodeToken =
        action.payload.VerificationCode.VerificationCode.Token;
      state.resendVerifyCodeToken =
        action.payload.VerificationCode.VerificationCode.Token;
    },
    sendResetPasswordTicketFailed: (state, action) => {
      state.isFetching = false;
    },
    signupLoadFiles: (state, action) => {
      state.fetchingFiles = true;
    },
    signupLoadFilesSuccess: (state, action) => {
      state.fetchingFiles = false;
      state.routeHistory = action.payload.destination;
      state.passwordPolicy = action.payload.result;
    },
    signupLoadFilesFailed: (state, action) => {
      state.fetchingFiles = false;
    },
    resetPassword: (state, action) => {
      state.isFetching = true;
    },
    resetPasswordSuccess: (state, action) => {
      state.isFetching = false;
    },
    resetPasswordFailed: (state, action) => {
      state.isFetching = false;
      state.verifyCodeError = action.payload;
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
      state.routeHistory = action.payload;
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
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
    },
  },
});

export default loginSlice.reducer;
