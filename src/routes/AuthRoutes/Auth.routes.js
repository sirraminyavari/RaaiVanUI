import { lazy } from 'react';

const SignIn = lazy(() =>
  import(/* webpackChunkName: "login"*/ 'views/Auth/items/SignIn')
);
const SignUp = lazy(() =>
  import(/* webpackChunkName: "register"*/ 'views/Auth/items/SignUp')
);
const VerifyingCode = lazy(() =>
  import(/* webpackChunkName: "verify-code"*/ 'views/Auth/items/VerifyingCode')
);
const ForgotPassword = lazy(() =>
  import(/* webpackChunkName: "forgot-pass"*/ 'views/Auth/items/ForgotPassword')
);
const ResetPasswordVerifying = lazy(() =>
  import(
    /* webpackChunkName: "reset-pass-verify"*/ 'views/Auth/items/ResetPasswordVerifying'
  )
);
const ResetPassword = lazy(() =>
  import(/* webpackChunkName: "reset-pass"*/ 'views/Auth/items/ResetPassword')
);

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
    path: '/auth/resetPasswordVerifying',
    name: 'resetPasswordVerifying',
    component: ResetPasswordVerifying,
  },
  {
    path: '/auth/forgotPassword',
    name: 'forgotPassword',
    component: ForgotPassword,
  },
  {
    path: '/auth/resetPassword',
    name: 'resetPassword',
    component: ResetPassword,
  },
];

export default routes;
