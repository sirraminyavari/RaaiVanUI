import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { authSaga } from './saga';
import { EmptyAuthState, IAuthState, ILoginRequest } from './types';
import { PayloadAction } from '@reduxjs/toolkit';
import { IReduxActionCall } from '../types';

const slice = createSlice({
  name: 'auth',
  initialState: EmptyAuthState,
  reducers: {
    login: (_state: IAuthState, _action: PayloadAction<ILoginRequest>) => {},
    loginStepTwo: (_state: IAuthState, _action: PayloadAction<any>) => {},
    loggedIn: (_state: IAuthState, _action: PayloadAction<any>) => {},
    loginSuccess: (state: IAuthState, action: PayloadAction<any>) => {
      state.lastLogins =
        action.payload.LastLogins || action.payload.lastLogins || [];
      state.loginMessage =
        action.payload.LoginMessage || action.payload.loginMessage;
      state.isFetching = false;
    },
    showLastLogins: (state: IAuthState, action: PayloadAction<any>) => {
      state.showLastLoginsModal = true;
      state.loginMessage = action.payload.message;
      state.lastLogins = action.payload.lastLogins;
    },
    loginStart: (state: IAuthState) => {
      state.isFetching = true;
    },
    loginFailed: (state: IAuthState, action) => {
      //state.error = action.payload;
      state.isFetching = false;
      state.emailError = action.payload;
      state.passwordError = action.payload;
    },
    logout: (
      _state: IAuthState,
      _action: PayloadAction<IReduxActionCall>
    ) => {},
    logoutSuccess: (state: IAuthState) => {
      state.isAuthenticated = false;
    },
    setEmail: (
      state: IAuthState,
      action: PayloadAction<string | undefined>
    ) => {
      state.email = action.payload;
      state.emailError = undefined;
    },
    setEmailError: (state: IAuthState, action: PayloadAction<string>) => {
      state.emailError = action.payload;
    },
    setPassword: (
      state: IAuthState,
      action: PayloadAction<string | undefined>
    ) => {
      state.password = action.payload;
      state.passwordError = undefined;
    },
    setPasswordError: (state: IAuthState, action: PayloadAction<string>) => {
      state.passwordError = action.payload;
    },
    setOrgDomainsError: (state: IAuthState, action: PayloadAction<string>) => {
      state.orgDomainsError = action.payload;
    },
    setAuthUser: (state: IAuthState, action) => {
      state.authUser = action.payload;
      window.RVGlobal.CurrentUser = action.payload;
      window.RVGlobal.CurrentUserID = action.payload?.UserID;
    },
    signupLoadFiles: (
      state: IAuthState,
      _action: PayloadAction<{ destination: string }>
    ) => {
      state.fetchingFiles = true;
    },
    signupLoadFilesSuccess: (
      state: IAuthState,
      action: PayloadAction<{ destination: string; result?: any }>
    ) => {
      state.fetchingFiles = false;
      state.routeHistory = action.payload.destination;
      state.passwordPolicy = action.payload.result;
    },
    signupLoadFilesFailed: (state: IAuthState, _action) => {
      state.fetchingFiles = false;
    },
    setLoginRoute: (
      state: IAuthState,
      action: PayloadAction<{ destination: string }>
    ) => {
      state.routeHistory = action.payload.destination;
    },
    resetAllErrors: (state: IAuthState) => {
      state.passwordError = undefined;
      //state.verifyCodeError = null;
      state.emailError = undefined;
      //state.nameError = null;
      //state.familyError = null;
      state.orgDomainsError = undefined;
    },
    setSelectedOrgDomain: (state: IAuthState, action) => {
      state.selectedDomain = action.payload;
      state.orgDomainsError = undefined;
    },
    setIsAthunticated: (state: IAuthState, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setCaptchaToken: (state: IAuthState, action) => {
      state.captchaToken = action.payload;
    },
    getDomains: (_state, _action: PayloadAction<IReduxActionCall>) => {
      //state.loading = true;
    },
    getDomainsResponse: (_state: IAuthState, _action) => {
      //state.domainsList = action.payload;
      //state.loading = false;
    },
  },
});

export const { actions: authActions } = slice;

export const useAuthSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: authSaga });
  return { actions: slice.actions };
};
