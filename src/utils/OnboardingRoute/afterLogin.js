const { default: APIHandler } = require('apiHelper/APIHandler');

const { RVGlobal, GlobalUtilities, RVAPI } = window;

const onboardingPageUrl = new APIHandler('RVAPI', 'OnboardingPageURL');
const afterLogin = async (response) => {
  const { User, AuthCookie, RedirectToOnboarding } = response || {};

  (RVGlobal || {}).CurrentUser = User;
  RVAPI.LoggedIn();
  GlobalUtilities.set_auth_cookie(AuthCookie);
  GlobalUtilities.hide_recaptcha();

  if (RedirectToOnboarding) {
    return new Promise((resolve, reject) => {
      onboardingPageUrl.url({}, (result) => {
        console.log(result, 'onboardingPageUrl');
        resolve(result);
      });
    });
  }
};
export default afterLogin;
