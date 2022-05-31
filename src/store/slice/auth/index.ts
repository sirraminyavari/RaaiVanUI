import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { authSaga } from './saga';
import { EmptyAuthState, IAuthState } from './types';
import { PayloadAction } from '@reduxjs/toolkit';
import { IReduxActionCall } from '../types';

const slice = createSlice({
  name: 'auth',
  initialState: EmptyAuthState,
  reducers: {
    login: (state: IAuthState, action: PayloadAction<any>) => {},
    loginStepTwo: (state: IAuthState, action: PayloadAction<any>) => {},
    loggedIn: (state: IAuthState, action: PayloadAction<any>) => {},
    loginSuccess: (state: IAuthState, action: PayloadAction<any>) => {
      //state.auth = action.payload;
      //state.isFetching = false;
    },
    showLastLogins: (state: IAuthState, action: PayloadAction<any>) => {
      //state.lastLoginModal = true;
      //state.lastLoginMessage = action.payload.message;
      //state.lastLogins = action.payload.lastLogins;
    },
    loginStart: (state) => {
      //state.isFetching = true;
    },
    loginFailed: (state, action) => {
      //state.error = action.payload;
      //state.isFetching = false;
      //state.emailError = action.payload;
      //state.passwordError = action.payload;
    },
    logout: (state: IAuthState, action: PayloadAction<IReduxActionCall>) => {},
    logoutSuccess: (state) => {
      //state.isAuthenticated = false;
    },
    setEmail: (state, action: PayloadAction<string | undefined>) => {
      state.email = action.payload;
      state.emailError = undefined;
    },
    setEmailError: (state, action: PayloadAction<string>) => {
      state.emailError = action.payload;
    },
    setPassword: (state, action: PayloadAction<string | undefined>) => {
      state.password = action.payload;
      state.passwordError = undefined;
    },
    setPasswordError: (state, action: PayloadAction<string>) => {
      state.passwordError = action.payload;
    },
    setOrgDomainsError: (state, action: PayloadAction<string>) => {
      state.orgDomainsError = action.payload;
    },
    setAuthUser: (state, action) => {
      state.authUser = action.payload;
      window.RVGlobal.CurrentUser = action.payload;
      window.RVGlobal.CurrentUserID = action.payload?.UserID;
    },
    signupLoadFiles: (state, action) => {
      //state.fetchingFiles = true;
    },
    signupLoadFilesSuccess: (
      state,
      action: PayloadAction<{ destination: string }>
    ) => {
      //state.fetchingFiles = false;
      //state.routeHistory = action.payload.destination;
      //state.passwordPolicy = action.payload.result;
    },
    signupLoadFilesFailed: (state, action) => {
      //state.fetchingFiles = false;
    },
    setLoginRoute: (state, action) => {
      //state.routeHistory = action.payload;
    },
    resetAllErrors: (state) => {
      //state.passwordError = null;
      //state.verifyCodeError = null;
      //state.emailError = null;
      //state.nameError = null;
      //state.familyError = null;
      //state.orgDomainsError = null;
    },
    setSelectedOrgDomain: (state, action) => {
      state.selectedDomain = action.payload;
      //state.orgDomainsError = null;
    },
    setIsAthunticated: (state, action) => {
      //state.isAuthenticated = action.payload;
    },
    setCaptchaToken: (state, action) => {
      //state.captchaToken = action.payload;
    },
    getDomains: (state, action) => {
      //state.loading = true;
    },
    getDomainsResponse: (state, action) => {
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
