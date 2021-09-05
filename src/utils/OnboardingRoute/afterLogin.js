const { default: APIHandler } = require('apiHelper/APIHandler');

const { RVGlobal, GlobalUtilities, RVAPI } = window;

const onboardingPageUrl = new APIHandler('RVAPI', 'OnboardingPageURL');
const afterLogin = (response) => {
  const { User, AuthCookie, RedirectToOnboarding } = response || {};

  (RVGlobal || {}).CurrentUser = User;
  RVAPI.LoggedIn();
  GlobalUtilities.set_auth_cookie(AuthCookie);
  GlobalUtilities.hide_recaptcha();

  if (RedirectToOnboarding) {
    return onboardingPageUrl.url();
  }
};
export default afterLogin;
