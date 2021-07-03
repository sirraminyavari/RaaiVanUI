/**
 * A component for showing some descriptions in different routes.
 */
import H5 from 'components/TypoGraphy/H5';
import { LIGHT_BLUE } from 'const/Colors';
import {
  FORGOT_PASSWORD,
  RESET_PASSWORD_SENT,
  SIGN_UP_EMAIL,
  SIGN_UP_EMAIL_COLLAPSED,
  SIGN_UP_PASSWORD,
  SIGN_UP_SUCCESS,
  VERIFICATION_CODE,
} from 'const/LoginRoutes';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { UpToDownAnimate } from './Animate.style';

const Description = () => {
  // We use ref to pass component dimension to 'UpToDownAnimate'
  const ref = useRef();

  const { currentRoute, password, isPasswordFocused } = useSelector(
    (state) => ({
      password: state.auth.password,
      currentRoute: state.auth.currentRoute,
      isPasswordFocused: state.auth.isPasswordFocused,
    })
  );
  const terms = () => (
    <p>
      {'با ثبت ایمیل در کلیک مایند، شما میپذیرید که '}
      <a
        href="http://www.cliqmind.com/%D9%82%D9%88%D8%A7%D9%86%DB%8C%D9%86-%D9%88-%D8%AA%D8%B9%D9%87%D8%AF%D8%A7%D8%AA/"
        target="_blank"
        style={{ color: 'blue' }}>
        {'قوانین کلیک مایند'}
      </a>
      {' را خوانده و به آن متعهد هستید '}
    </p>
  );
  const resetPass = () => (
    <p>
      {
        'در صورتی که این ایمیل در کلیک‌مایند ثبت شده باشد، لینک تغییر رمزعبور برای شما ارسال خواهد شد'
      }
    </p>
  );
  const linkSent = () => (
    <p>
      {
        'درخواست شما برای ارسال لینک تغییر رمزعبور ارسال شد، لطفا از طریق حساب ایمیل خود و لینک ارسال شده مراحل بعدی را دنبال کنید.'
      }
    </p>
  );
  const signedUp = () => (
    <p>
      {
        'ثبت نام شما با موفقیت انجام شد، لطفا برای فعالسازی حساب، از طریق لینک ارسال شده در صندوق ایمیل خود .مراحل بعدی را دنبال کنید'
      }
    </p>
  );
  const verification = () => (
    <p>
      {
        'لطفاً کد تایید حساب خود را، که به شماره موبایل بالا ارسال شده، در کادر زیر وارد نمایید'
      }
    </p>
  );
  /**
   * According to 'currentRoute'
   * this function decides to return true or false &
   * also returns suitable 'label'
   */
  const isVisible = () => {
    switch (currentRoute) {
      case SIGN_UP_EMAIL:
      case SIGN_UP_EMAIL_COLLAPSED:
        return {
          label: terms(),
          visible: !isPasswordFocused,
        };
      case SIGN_UP_PASSWORD:
        return {
          label: terms(),
          visible: password.length === 0 && true,
        };
      case VERIFICATION_CODE:
        return {
          label: verification(),
          visible: true,
        };

      case FORGOT_PASSWORD:
        return {
          label: resetPass(),

          visible: true,
        };
      case SIGN_UP_SUCCESS:
        return {
          label: signedUp(),
          visible: true,
        };
      case RESET_PASSWORD_SENT:
        return {
          label: linkSent(),
          visible: true,
        };
      default:
        return false;
    }
  };

  return (
    <UpToDownAnimate
      style={{ marginTop: '2rem' }}
      ref={ref}
      dimension={ref?.current?.getBoundingClientRect()}
      isVisible={isVisible().visible}>
      <H5
        style={{
          fontSize: '0.8rem',
          color: `${LIGHT_BLUE}`,
        }}>
        {isVisible().label}
      </H5>
    </UpToDownAnimate>
  );
};

export default Description;
