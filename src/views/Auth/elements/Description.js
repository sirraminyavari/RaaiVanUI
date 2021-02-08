import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import setEmailAction from 'store/actions/auth/setEmailAction';
import { CollapseAnimate, UpToDownAnimate } from './Animate.style';
import {
  FORGOT_PASSWORD,
  RESET_PASSWORD_SENT,
  SIGN_IN,
  SIGN_IN_COLLAPSED,
  SIGN_UP_EMAIL,
  SIGN_UP_EMAIL_COLLAPSED,
  SIGN_UP_PASSWORD,
  SIGN_UP_SUCCESS,
} from 'const/LoginRoutes';
import H5 from 'components/TypoGraphy/H5';
import { LIGHT_BLUE } from 'const/Colors';

const Description = () => {
  const dispatch = useDispatch();
  const { currentRoute, password } = useSelector((state) => ({
    password: state.login.password,
    currentRoute: state.loginRoute.currentRoute,
  }));
  const terms = () => (
    <p>
      {'با ثبت ایمیل در کلیک مایند، شما میپذیرید که '}
      <a style={{ color: 'blue' }}>{'قوانین کلیک مایند'}</a>
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
  const isVisible = (currentRoute) => {
    switch (currentRoute) {
      case SIGN_UP_EMAIL:
      case SIGN_UP_EMAIL_COLLAPSED:
        return {
          label: terms(),
          visible: true,
        };
      case SIGN_UP_PASSWORD:
        return {
          label: terms(),
          visible: password.length === 0 && true,
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
    <CollapseAnimate
      style={{ flexGrow: '0.8' }}
      isVisible={isVisible(currentRoute).visible}>
      <H5
        style={{
          fontSize: '0.8rem',
          color: `${LIGHT_BLUE}`,
        }}>
        {isVisible(currentRoute).label}
      </H5>
    </CollapseAnimate>
  );
};

export default Description;
