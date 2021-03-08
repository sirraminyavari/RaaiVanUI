/**
 * A component for guiding the user to inout the validate password
 */
import CancelCircle from 'components/Icons/CancelCircle';
import CheckCircle from 'components/Icons/CheckCircle';
import H6 from 'components/TypoGraphy/H6';
import { LIGHT_BLUE, MAIN_BLUE } from 'const/Colors';
import { RED } from 'constant/Colors';
import React from 'react';
import styled from 'styled-components';
import PasswordValidator from 'utils/Valiation/PasswordValidator';
import { CollapseAnimate } from './Animate.style';

const { RVDic } = window;
/**
 *
 * @param {Boolean} isVisible - If true, password validation will be shown.
 * @param {String} password - Inputted password.
 * @param {Object} passwordPolicy - The policies, user should occupy while choosing password.
 */
const PasswordValidation = ({ isVisible, password, passwordPolicy }) => {
  console.log(passwordPolicy, password, '< - - - - - - -');
  /**
   *
   * @param {Sting} text - message for password validator
   * @param {Boolean} validator - True, if inputted password passes the current validator
   */
  const ValidatorItems = ({ text, validator }) => {
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
    <CollapseAnimate style={{ marginTop: '1rem' }} isVisible={isVisible}>
      <Container>
        <ValidatorItems
          text={'حداقل ۸ کارکتر'}
          validator={PasswordValidator(password, passwordPolicy)?.MinLength}
        />
        <ValidatorItems
          text={RVDic.PasswordPolicyNumber}
          validator={PasswordValidator(password, passwordPolicy)?.NonAlphabetic}
        />
        <ValidatorItems
          text={RVDic.PasswordPolicyUpperLower}
          validator={PasswordValidator(password, passwordPolicy)?.UpperLower}
        />
      </Container>
    </CollapseAnimate>
  );
};

export default PasswordValidation;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const Items = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  margin: 3px;
  padding: 3px;
`;
