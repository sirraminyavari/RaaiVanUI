/**
 * Returns a list of authentication routes.
 */
import SignIn from 'views/Auth/items/SignIn';
import SignUp from 'views/Auth/items/SignUp';
import ForgotPassword from 'views/Auth/items/ForgotPassword';
import ResetPasswordAddress from 'views/Auth/items/ResetPasswordAddress';
import ResetPassword from 'views/Auth/items/ResetPassword';
import {
  LOGIN_NAME,
  LOGIN_PATH,
  FORGOT_PASS_PATH,
  REGISTER_PATH,
  RESET_PASS_ADDRESS_PATH,
  RESET_PASS_PATH,
} from 'constant/constants';

const routes = [
  {
    path: LOGIN_PATH,
    name: LOGIN_NAME,
    component: SignIn,
  },
  {
    path: REGISTER_PATH,
    name: LOGIN_NAME,
    component: SignUp,
  },
  {
    path: FORGOT_PASS_PATH,
    name: LOGIN_NAME,
    component: ForgotPassword,
  },
  {
    path: RESET_PASS_ADDRESS_PATH,
    name: LOGIN_NAME,
    component: ResetPasswordAddress,
  },
  {
    path: RESET_PASS_PATH,
    name: LOGIN_NAME,
    component: ResetPassword,
  },
];

export default routes;
