/**
 * A mother component for all login components.
 */
import Loader from 'components/Loaders/LogoLoader/LogoLoader';
import Logo from 'components/Media/Logo';
import { LOGIN_PATH } from 'constant/constants';
import { decode } from 'js-base64';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
// import useCheckRoute from 'hooks/useCheckRoute';
import Routes from 'routes/AuthRoutes/Auth.routes';
import setCaptchaTokenAction from 'store/actions/auth/setCaptchaToken';
import {
  BackgroundImage,
  Center,
  Container,
  Maintainer,
  Wrapper,
} from './AuthView.style';

/**
 * A mother component for containing the login elements.
 */
const AuthView = () => {
  const {
    RVGlobal,
    GlobalUtilities,
    UsersAPI,
    RVDic,
    RVAPI,
    SAASBasedMultiTenancy,
  } = window;

  // True, if required files for the login page has been loaded.
  const [loadDone, setLoadDone] = useState(false);
  // True, if activationCode of reset password ticket has been checked.
  const [preinitDone, setPreinitDone] = useState(false);
  // True, if org domains has been checked.(final step)
  const [oneStepToInitDone, setOneStepToInit] = useState(false);

  const dispatch = useDispatch();
  const { push } = useHistory();
  let location = useLocation();

  useEffect(() => {
    let files = [{ Root: 'API/', Ext: 'js', Childs: ['RVAPI', 'UsersAPI'] }];
    // if (that.Options.UseCaptcha) files.push("CaptchaImage.js");
    GlobalUtilities?.load_files(files, {
      OnLoad: () => {
        setLoadDone(true);
      },
    });
  }, []);

  useEffect(() => {
    if (loadDone) {
      const reqParams = GlobalUtilities?.request_params();
      const activationCode = reqParams?.get_value('ac');
      const userName = reqParams?.get_value('un');
      const passwordTicket = reqParams?.get_value('pt');

      if (activationCode) {
        UsersAPI?.ActivateTemporaryUser({
          ActivationCode: activationCode,
          ResponseHandler: function (responseText) {
            const result = JSON?.parse(responseText);
            if (result?.Succeed)
              alert(RVDic?.MSG[result?.Succeed], { Timeout: 30000 });
            if (result?.ErrorText) alert(RVDic?.MSG[result?.ErrorText]);
            setPreinitDone(true);
          },
        });
      } else if (passwordTicket) {
        // that.show_reset_password_form(passwordTicket, userName);
        // dispatch(setLoginRouteAction(RESET_PASSWORD));
        push('/auth/resetPassword' + window.location.search);

        setPreinitDone(true);
      } else setPreinitDone(true);
    }
  }, [loadDone]);

  useEffect(() => {
    if (!SAASBasedMultiTenancy) {
      RVAPI?.GetDomains({
        ParseResults: true,
        ResponseHandler: function (r) {
          for (var i = 0, lnt = (r.Domains || []).length; i < lnt; ++i) {
            r.Domains[i].Value = decode(r?.Domains[i].Value);
            r.Domains[i].Text = decode(r?.Domains[i].Text);
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
    const script = document?.createElement('script');
    // reCaptcha is just for SAAS
    if (RVGlobal.SAASBasedMultiTenancy) {
      script.src = RVGlobal?.CaptchaURL;
      script?.addEventListener('load', handleLoaded);
      document?.body?.appendChild(script);
    }
    return () => {
      // removes reCapctha when component willunmount
      RVGlobal?.SAASBasedMultiTenancy && document?.body?.removeChild(script);
    };
  }, [oneStepToInitDone]);

  // const route = useCheckRoute('/login');
  // console.log(route);

  const switchRoutes = (
    <Wrapper>
      <TransitionGroup className="transition-group">
        {/*
      This is no different than other usage of
      <CSSTransition>, just make sure to pass
      `location` to `Switch` so it can match
      the old location as it animates out.
    */}

        <CSSTransition key={location?.key} classNames="fade" timeout={1000}>
          <Switch location={location}>
            {Routes?.map((route, key) => {
              const { path, component } = route;
              return (
                <Route exact path={path} component={component} key={key} />
              );
            })}

            <Redirect to={LOGIN_PATH} />
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </Wrapper>
  );

  /**
   *
   * By finishing loading the script, will fire.
   * Sets token to redux store.
   */
  const handleLoaded = () => {
    const { GlobalUtilities } = window;

    GlobalUtilities?.init_recaptcha((captcha) => {
      captcha?.getToken((token) => {
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
        {/* <Box> */}
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
        {/* <SignIn /> */}
        {oneStepToInitDone ? (
          switchRoutes
        ) : (
          <Center>
            <Loader />
          </Center>
        )}
        {/* </Box> */}
      </Container>
      <div className="small-1 medium-2 large-4" />
    </Maintainer>
  );
};

export default AuthView;
