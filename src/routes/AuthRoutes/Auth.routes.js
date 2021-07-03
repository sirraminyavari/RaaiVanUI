/**
 * Returns a list of authentication routes.
 */
import SignIn from 'views/Auth/items/SignIn';
import SignUp from 'views/Auth/items/SignUp';
import VerifyingCode from 'views/Auth/items/VerifyingCode';
import ForgotPassword from 'views/Auth/items/ForgotPassword';
import ResetPasswordAddress from 'views/Auth/items/ResetPasswordAddress';
import VerifyingResetPassword from 'views/Auth/items/VerifyingResetPassword';
import ResetPassword from 'views/Auth/items/ResetPassword';

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
