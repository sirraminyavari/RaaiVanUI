/**
 * A component for login with username & password
 */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import LoginByUserPass from './items/LoginByUserPass';
import OrgDomainsList from './items/OrgDomainsList';
import ResetPasswordForm from './items/ResetPasswordForm';
import SignInMethods from './items/SignInMethods';

const LoginControl = () => {
  const [showResetPass, setShowResetPass] = useState(false);

  useEffect(() => {
    const { GlobalUtilities, UsersAPI, RVDic } = window;
    const reqParams = GlobalUtilities.request_params();
    const activationCode = reqParams.get_value('ac');
    const passwordTicket = reqParams.get_value('pt');
    let files = [{ Root: 'API/', Ext: 'js', Childs: ['RVAPI', 'UsersAPI'] }];
    // if (that.Options.UseCaptcha) files.push("CaptchaImage.js");

    GlobalUtilities.load_files(files, {
      OnLoad: function () {
        if (activationCode) {
          UsersAPI.ActivateTemporaryUser({
            ActivationCode: activationCode,
            ResponseHandler: function (responseText) {
              const result = JSON.parse(responseText);
              if (result.Succeed)
                alert(RVDic.MSG[result.Succeed], { Timeout: 30000 });
              if (result.ErrorText) alert(RVDic.MSG[result.ErrorText]);
              console.log(" doesn't have activation code");
            },
          });
        } else if (passwordTicket) {
          setShowResetPass(true);
        }
      },
    });
  }, []);

  return (
    <Container>
      <OrgDomainsList />
      <LoginByUserPass />
      <SignInMethods />
      {showResetPass && <ResetPasswordForm />}
    </Container>
  );
};
export default LoginControl;

export const Container = styled.div`
  display: flex;
  width: ${(props) => (props.isTabletOrMobile ? `90vw` : `40vw`)};
  max-width: 100%;
  height: 80vh;
  border-radius: 13px;
  flex-direction: column;
  justify-content: space-around;
`;
