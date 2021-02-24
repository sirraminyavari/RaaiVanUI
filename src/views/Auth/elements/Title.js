/**
 * A component for showing the title to user.
 */
import Heading from 'components/Heading/Heading';
import H3 from 'components/TypoGraphy/H3';
import {
  FORGOT_PASSWORD,
  SIGN_IN,
  SIGN_IN_COLLAPSED,
  SIGN_UP_EMAIL,
  SIGN_UP_EMAIL_COLLAPSED,
  SIGN_UP_PASSWORD,
} from 'const/LoginRoutes';
import React from 'react';
import { useSelector } from 'react-redux';
import { UpToDownAnimate } from './Animate.style';

const { RVDic } = window;

const Title = () => {
  const { currentRoute } = useSelector((state) => ({
    currentRoute: state.login.currentRoute,
  }));

  /**
   * According to 'currentRoute'
   * this function returns suitable String.
   */
  const title = () => {
    switch (currentRoute) {
      case SIGN_UP_EMAIL:
      case SIGN_UP_EMAIL_COLLAPSED:
      case SIGN_UP_PASSWORD:
        return RVDic.SignUp;
      case SIGN_IN:
      case SIGN_IN_COLLAPSED:
        return RVDic.Login;
      case FORGOT_PASSWORD:
        return 'فراموشی رمز عبور';
    }
  };

  return (
    <UpToDownAnimate isVisible={true}>
      <Heading type="h5" style={{ marginTop: '2rem' }}>
        {title()}
      </Heading>
    </UpToDownAnimate>
  );
};
export default Title;
