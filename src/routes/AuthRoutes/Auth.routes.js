/**
 * Returns a list of authentication routes.
 */
import { lazy } from 'react';
import SignIn from 'views/Auth/items/SignIn';
import SignUp from 'views/Auth/items/SignUp';
import VerifyingCode from 'views/Auth/items/VerifyingCode';
import ForgotPassword from 'views/Auth/items/ForgotPassword';
import ResetPasswordAddress from 'views/Auth/items/ResetPasswordAddress';
import VerifyingResetPassword from 'views/Auth/items/VerifyingResetPassword';
import ResetPassword from 'views/Auth/items/ResetPassword';

// const SignIn = lazy(() =>
//   import(/* webpackChunkName: "login"*/ 'views/Auth/items/SignIn')
// );
// const SignUp = lazy(() =>
//   import(/* webpackChunkName: "register"*/ 'views/Auth/items/SignUp')
// );
// const VerifyingCode = lazy(() =>
//   import(/* webpackChunkName: "verify-code"*/ 'views/Auth/items/VerifyingCode')
// );
// const ForgotPassword = lazy(() =>
//   import(/* webpackChunkName: "forgot-pass"*/ 'views/Auth/items/ForgotPassword')
// );
// const ResetPasswordAddress = lazy(() =>
//   import(
//     /* webpackChunkName: "forgot-pass"*/ 'views/Auth/items/ResetPasswordAddress'
//   )
// );
// const VerifyingResetPassword = lazy(() =>
//   import(
//     /* webpackChunkName: "reset-pass-verify"*/ 'views/Auth/items/VerifyingResetPassword'
//   )
// );
// const ResetPassword = lazy(() =>
//   import(/* webpackChunkName: "reset-pass"*/ 'views/Auth/items/ResetPassword')
// );

const routes = [
  {
    path: '/auth/login',
    name: 'login',
    component: SignIn,
  },
  {
    path: '/auth/register',
    name: 'register',
    component: SignUp,
  },
  {
    path: '/auth/verificationCode',
    name: 'verificationCode',
    component: VerifyingCode,
  },
  {
    path: '/auth/verifyingResetPassword',
    name: 'verifyingResetPassword',
    component: VerifyingResetPassword,
  },
  {
    path: '/auth/forgotPassword',
    name: 'forgotPassword',
    component: ForgotPassword,
  },
  {
    path: '/auth/resetPasswordAddress',
    name: 'resetPasswordAddress',
    component: ResetPasswordAddress,
  },
  {
    path: '/auth/resetPassword',
    name: 'resetPassword',
    component: ResetPassword,
  },
];

export default routes;
