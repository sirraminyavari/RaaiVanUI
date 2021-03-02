/**
 * A button for returning to the previous page.
 */
import Button from 'components/Buttons/Button';
import TextButton from 'components/Buttons/TextButton';
import { FORGOT_PASSWORD, SIGN_IN } from 'const/LoginRoutes';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import setLoginRouteAction from 'store/actions/auth/setLoginRouteAction';
import styled from 'styled-components';
import { UpToDownAnimate } from './Animate.style';

const { RVDic } = window;
const Return = () => {
  const dispatch = useDispatch();

  /**
   * According to 'currentRoute'
   * this function decides to return true or false.
   */
  const isVisible = (currentRoute) => {
    switch (currentRoute) {
      case FORGOT_PASSWORD:
        return true;

      default:
        return false;
    }
  };
  const { currentRoute } = useSelector((state) => ({
    currentRoute: state.login.currentRoute,
  }));
  /**
   * By clicking the button, will fire.
   */
  const onReturn = () => {
    dispatch(setLoginRouteAction(SIGN_IN));
  };

  return (
    <UpToDownAnimate
      isVisible={isVisible(currentRoute)}
      style={{ marginTop: '2rem' }}>
      {/* <TextButton onClick={onReturn}>{RVDic.Return}</TextButton> */}
      <Button type="secondary-o" style={{ width: '100%' }} onClick={onReturn}>
        {RVDic.Return}
      </Button>
    </UpToDownAnimate>
  );
};

export default Return;
