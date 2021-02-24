/**
 * An action for step two of signing in
 */
import { loginSlice } from '../../reducers/loginReducer';
import loggedInAction from './loggedInAction';

const { setPassword, setEmail } = loginSlice.actions;
const { GlobalUtilities, RVDic, RVAPI } = window;

/**
 * A procedure should be done if the backend detects two-step verification is needed.
 * @param {Object} data - Comes from backend
 */
const stepTwoAction = (data) => async (dispatch, getState) => {
  const { login } = getState();
  const vcd = GlobalUtilities.verification_code_dialog(data, {
    Message: RVDic.MSG.AnAuthenticationCodeHasBeenSentToYourNWithValueM,
    HideCancelButton: true,
    Callback: function (d, done) {
      if (!d) return;

      RVAPI.LoginStepTwo({
        Token: d.Token,
        Code: d.Code,
        InvitationID: login.Objects.InvitationID,
        ParseResults: true,
        ResponseHandler: function (result) {
          if (result.ErrorText) {
            alert(
              RVDic.MSG[result.ErrorText] || result.ErrorText,
              null,
              function () {
                // that.clear();
                dispatch(setPassword(''));
                dispatch(setEmail(''));

                done(false);
                if (result.CodeDisposed) vcd.Close();
              }
            );
          } else if (result.Succeed) {
            done(true);
            // that.logged_in(result);

            dispatch(loggedInAction(result));
          }
        },
      });
    },
  });
};
export default stepTwoAction;
