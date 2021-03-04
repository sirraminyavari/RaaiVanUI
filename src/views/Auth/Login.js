/**
 * A mother component for all login components.
 */
import Loader from 'components/Loader/Loader';
import Logo from 'components/Media/Logo';
import { RESET_PASSWORD } from 'const/LoginRoutes';
import useCheckRoute from 'hooks/useCheckRoute';
import { decode } from 'js-base64';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import setCaptchaTokenAction from 'store/actions/auth/setCaptchaToken';
import setLoginRouteAction from 'store/actions/auth/setLoginRouteAction';
import setOrgDomainsAction from 'store/actions/auth/setOrgDomainsAction';
import ContinueWithGoogle from './elements/ContinueWithGoogle';
import CreateAccountButton from './elements/CreateAccountButton';
import Description from './elements/Description';
import Email from './elements/Email';
import ForgotPassword from './elements/ForgotPassword';
import LastLoginsModal from './elements/LastLoginsModal';
import NameFamily from './elements/NameFamily';
import NavigationButton from './elements/NavigationButton';
import OrgDomains from './elements/OrgDomains';
import Password from './elements/Password';
import PasswordValidation from './elements/PasswordValidation';
import ResendCode from './elements/ResendCode';
import Return from './elements/Return';
import Title from './elements/Title';
import VerificationCode from './elements/VerificationCode';
import SignIn from './items/SignIn';
import {
  BackgroundImage,
  Box,
  Center,
  Container,
  Maintainer,
} from './Login.style';

const { RVGlobal } = window;

/**
 * A mother component for containing the login elements.
 */
const Login = () => {
  // True, if required files for the login page has been loaded.
  const [loadDone, setLoadDone] = useState(false);
  // True, if activationCode of reset password ticket has been checked.
  const [preinitDone, setPreinitDone] = useState(false);
  // True, if org domains has been checked.(final step)
  const [oneStepToInitDone, setOneStepToInit] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const { GlobalUtilities } = window;

    let files = [{ Root: 'API/', Ext: 'js', Childs: ['RVAPI', 'UsersAPI'] }];
    // if (that.Options.UseCaptcha) files.push("CaptchaImage.js");
    GlobalUtilities.load_files(files, {
      OnLoad: () => {
        setLoadDone(true);
      },
    });
    console.log(window, '<--- window');
  }, []);

  useEffect(() => {
    if (loadDone) {
      const { GlobalUtilities, UsersAPI, RVDic } = window;
      const reqParams = GlobalUtilities.request_params();
      const activationCode = reqParams.get_value('ac');
      const userName = reqParams.get_value('un');
      const passwordTicket = reqParams.get_value('pt');

      if (activationCode) {
        UsersAPI.ActivateTemporaryUser({
          ActivationCode: activationCode,
          ResponseHandler: function (responseText) {
            const result = JSON.parse(responseText);
            if (result.Succeed)
              alert(RVDic.MSG[result.Succeed], { Timeout: 30000 });
            if (result.ErrorText) alert(RVDic.MSG[result.ErrorText]);
            setPreinitDone(true);
          },
        });
      } else if (passwordTicket) {
        // that.show_reset_password_form(passwordTicket, userName);
        dispatch(setLoginRouteAction(RESET_PASSWORD));
        setPreinitDone(true);
      } else setPreinitDone(true);
    }
  }, [loadDone]);

  useEffect(() => {
    const { RVAPI, SAASBasedMultiTenancy } = window;
    if (!SAASBasedMultiTenancy) {
      RVAPI.GetDomains({
        ParseResults: true,
        ResponseHandler: function (r) {
          for (var i = 0, lnt = (r.Domains || []).length; i < lnt; ++i) {
            r.Domains[i].Value = decode(r.Domains[i].Value);
            r.Domains[i].Text = decode(r.Domains[i].Text);
          }

          // that.initialize(r.Domains || []);
          // dispatch(setOrgDomainsAction(r.Domains));
          // dispatch(
          //   setOrgDomainsAction([
          //     { Value: 'example.com', Title: 'some title' },
          //     { Value: 'example2.com', Title: 'some title 2' },
          //     { Value: 'example3.com', Title: 'some title 3' },
          //     { Value: 'example4.com', Title: 'some title 4' },
          //     { Value: 'example5.com', Title: 'some title 5' },
          //     { Value: 'example6.com', Title: 'some title 6' },
          //     { Value: 'example7.com', Title: 'some title 7' },
          //   ])
          // );
          setOneStepToInit(true);
        },
      });
    }
  }, [preinitDone]);

  // After all steps finished, it's time to init the reCaptcha.
  useEffect(() => {
    const script = document.createElement('script');
    // reCaptcha is just for SAAS
    if (RVGlobal.SAASBasedMultiTenancy) {
      script.src = RVGlobal.CaptchaURL;
      script.addEventListener('load', handleLoaded);
      document.body.appendChild(script);
    }
    return () => {
      // removes reCapctha when component willunmount
      RVGlobal.SAASBasedMultiTenancy && document.body.removeChild(script);
    };
  }, [oneStepToInitDone]);

  /**
   *
   * By finishing loading the script, will fire.
   * Sets token to redux store.
   */
  const handleLoaded = () => {
    const { GlobalUtilities } = window;
    GlobalUtilities.init_recaptcha((captcha) => {
      captcha.getToken((token) => {
        //use token
        dispatch(setCaptchaTokenAction(token));
      });
    });
  };
  return (
    <Maintainer className="small-12 medium-12 large-12 row">
      <BackgroundImage />

      <div className="small-1 medium-2 large-4" />
      <Container className="small-10 medium-8 large-4">
        <Logo />
        {oneStepToInitDone ? (
          <Box>
            {/* <Title />
            <Email />
            <NameFamily />
            <Password />
            <OrgDomains />
            <PasswordValidation />
            <Description />
            <VerificationCode />
            <ResendCode />
            <NavigationButton />
            <ForgotPassword />
            <Return />
            <ContinueWithGoogle />
            <CreateAccountButton />

            <LastLoginsModal /> */}
            <SignIn />
          </Box>
        ) : (
          <Center>
            <Loader />
          </Center>
        )}
      </Container>
      <div className="small-1 medium-2 large-4" />
    </Maintainer>
  );
};

export default Login;
