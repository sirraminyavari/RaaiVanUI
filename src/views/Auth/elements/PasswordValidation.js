/**
 * A component for guiding the user to inout the validate password
 */
import CancelCircle from 'components/Icons/CancelCircle';
import CheckCircle from 'components/Icons/CheckCircle';
import H6 from 'components/TypoGraphy/H6';
import { LIGHT_BLUE, MAIN_BLUE } from 'const/Colors';
import {
  RESET_PASSWORD,
  SIGN_UP_EMAIL,
  SIGN_UP_PASSWORD,
} from 'const/LoginRoutes';
import { RED } from 'constant/Colors';
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
    password: state.auth.password,
    currentRoute: state.auth.currentRoute,
    isPasswordFocused: state.auth.isPasswordFocused,
    passwordPolicy: state.auth.passwordPolicy,
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
    console.log(validator, '<***---');
    return (
      <Items>
        {validator ? (
          <CheckCircle
            style={{
              fontSize: '0.9rem',
              color: `${MAIN_BLUE}`,
            }}
          />
        ) : (
          <CancelCircle
            style={{
              fontSize: '0.9rem',
              color: `${RED}`,
            }}
          />
        )}
        <H6
          style={{
            color: validator ? MAIN_BLUE : LIGHT_BLUE,
            marginRight: '7px',
          }}>
          {text}
        </H6>
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
  align-items: center;

  margin: 3px;
  padding: 3px;
`;
