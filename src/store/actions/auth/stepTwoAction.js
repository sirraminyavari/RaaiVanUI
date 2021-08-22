/**
 * An action for step two of signing in
 */
import APIHandler from 'apiHelper/APIHandler';
import { loginSlice } from '../../reducers/loginReducer';
import loggedInAction from './loggedInAction';

const { setPassword, setEmail } = loginSlice.actions;
const { GlobalUtilities, RVDic, RVAPI, RVGlobal } = window;

/**
 * A process should be done if the backend detects two-step verification is needed.
 * @param {Object} data - Comes from backend
 */

const loginStepTwo = new APIHandler('RVAPI', 'LoginStepTwo');
const stepTwoAction = (data) => async (dispatch, getState) => {
  const { auth } = getState();
  const vcd = GlobalUtilities.verification_code_dialog(data, {
    Message: RVDic.MSG.AnAuthenticationCodeHasBeenSentToYourNWithValueM,
    HideCancelButton: true,
    Callback: function (d, done) {
      if (!d) return;

      loginStepTwo.fetch(
        {
          Token: d.Token,
          Code: d.Code,
          InvitationID: auth.Objects.InvitationID,
          ParseResults: true,
        },

        (result) => {
          if (result.ErrorText) {
            alert(RVDic.MSG[result.ErrorText] || result.ErrorText);
            // that.clear();
            dispatch(setPassword(''));
            dispatch(setEmail(''));

            done(false);
            if (result.CodeDisposed) vcd.Close();
          } else if (result.Succeed) {
            (RVGlobal || {}).CurrentUser = result?.User;

            done(true);
            // that.logged_in(result);

            dispatch(loggedInAction(result));
          }
        }
      );
    },
  });
};
export default stepTwoAction;
