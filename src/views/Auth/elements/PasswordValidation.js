/**
 * A component for guiding the user to inout the validate password
 */
import CheckCircle from 'components/Icons/CheckCircle';
import H6 from 'components/TypoGraphy/H6';
import { LIGHT_BLUE, MAIN_BLUE } from 'const/Colors';
import {
  RESET_PASSWORD,
  SIGN_UP_EMAIL,
  SIGN_UP_PASSWORD,
} from 'const/LoginRoutes';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import PasswordValidator from 'utils/Valiation/PasswordValidator';
import { CollapseAnimate } from './Animate.style';

const PasswordValidation = () => {
  const {
    password,
    currentRoute,
    isPasswordFocused,
    passwordPolicy,
  } = useSelector((state) => ({
    password: state.login.password,
    currentRoute: state.login.currentRoute,
    isPasswordFocused: state.login.isPasswordFocused,
    passwordPolicy: state.login.passwordPolicy,
  }));
  // Checks password field if is focused.
  useEffect(() => {
    isVisible();
  }, [isPasswordFocused]);
  /**
   * According to 'currentRoute'
   * this function decides to return true or false.
   */
  const isVisible = () => {
    switch (currentRoute) {
      case SIGN_UP_PASSWORD:
      case RESET_PASSWORD:
      case SIGN_UP_EMAIL:
        return isPasswordFocused;
      default:
        return false;
    }
  };
  /**
   *
   * @param {Sting} text - message for password validator
   * @param {Boolean} validator - True, if inputted password passes the current validator
   */
  const ValidatorItems = ({ text, validator }) => {
    return (
      <Items>
        <H6
          style={{
            color: validator ? MAIN_BLUE : LIGHT_BLUE,
            marginRight: '7px',
          }}>
          {text}
        </H6>
        <CheckCircle
          style={{
            color: validator ? `${MAIN_BLUE}` : 'rgba(1,1,1,0)',
          }}
        />
      </Items>
    );
  };

  return (
    <CollapseAnimate style={{ marginTop: '2rem' }} isVisible={isVisible()}>
      {isVisible() && (
        <Container>
          <ValidatorItems
            text={'حداقل ۸ کارکتر'}
            validator={PasswordValidator(password, passwordPolicy)?.MinLength}
          />
          <ValidatorItems
            text={'حداقل یک عدد'}
            validator={
              PasswordValidator(password, passwordPolicy)?.NonAlphabetic
            }
          />
          <ValidatorItems
            text={'حداقل یک حرف بزرگ و کوچک'}
            validator={PasswordValidator(password, passwordPolicy)?.UpperLower}
          />
        </Container>
      )}
    </CollapseAnimate>
  );
};

export default PasswordValidation;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
`;
const Items = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-end;
  margin: 3px;
  padding: 3px;
`;
