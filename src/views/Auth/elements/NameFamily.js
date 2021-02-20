/**
 * A component for entering name & family name
 */
import AnimatedInput from 'components/Inputs/AnimatedInput';
import { SIGN_UP_EMAIL, SIGN_UP_PASSWORD } from 'const/LoginRoutes';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import setFamilyAction from 'store/actions/auth/setFamilyAction';
import setNameAction from 'store/actions/auth/setNameAction';
import styled from 'styled-components';
import { UpToDownAnimate } from './Animate.style';

const { RVDic } = window;
const NameFamily = () => {
  const dispatch = useDispatch();
  const { currentRoute, name, nameError, family, familyError } = useSelector(
    (state) => ({
      currentRoute: state.login.currentRoute,
      family: state.login.family,
      familyError: state.login.familyError,
      name: state.login.name,
      nameError: state.login.nameError,
    })
  );
  /**
   * According to 'currentRoute'
   * this function decides to return true or false.
   */
  const isVisible = () => {
    switch (currentRoute) {
      case SIGN_UP_EMAIL:
        return true;
      default:
        return false;
    }
  };
  /**
   * Synchronously set user inputted value to Redux state
   * @param {String} value - inputted user name
   */
  const onNameChanged = (value) => {
    dispatch(setNameAction(value));
  };
  /**
   * Synchronously set user inputted value to Redux state
   * @param {String} value - inputted user family
   */
  const onFamilyChanged = (value) => {
    dispatch(setFamilyAction(value));
  };

  return (
    <UpToDownAnimate isVisible={isVisible()}>
      <Container>
        <AnimatedInput
          onChange={onNameChanged}
          value={name}
          placeholder={RVDic.Name}
          style={{ marginLeft: '0.5rem' }}
          error={nameError}
        />
        <AnimatedInput
          onChange={onFamilyChanged}
          value={family}
          placeholder={RVDic.LastName}
          style={{ marginRight: '0.5rem' }}
          error={familyError}
          tabIndex="2"
        />
      </Container>
    </UpToDownAnimate>
  );
};
export default NameFamily;
const Container = styled.div`
  display: flex;
  position: relative;
  flex-direction: row-reverse;
  margin-top: 1.5rem;
`;
