/**
 * A component for guiding the user to inout the validate password
 */
import CancelCircle from 'components/Icons/CancelCircle';
import CheckCircle from 'components/Icons/CheckCircle';
import H6 from 'components/TypoGraphy/H6';
import { LIGHT_BLUE, MAIN_BLUE } from 'constant/Colors';
import { RED } from 'constant/Colors';
import React from 'react';
import styled from 'styled-components';
import PasswordValidator from 'utils/Validation/PasswordValidator';
// import { CollapseAnimate } from '../../views/Auth/elements/Animate.style';

const { RVDic } = window;
/**
 *
 * @param {Boolean} isVisible - If true, password validation will be shown.
 * @param {String} password - Inputted password.
 * @param {Object} passwordPolicy - The policies, user should occupy while choosing password.
 * @param {Boolean} resetingPass - If true, checks password for new chars
 */
const PasswordValidation = ({
  isVisible,
  password,
  passwordPolicy,
  resetingPass,
}) => {
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
            className={'rv-default'}
            style={{
              fontSize: '0.9rem',
              // color: `${MAIN_BLUE}`,
            }}
          />
        ) : (
          <CancelCircle
            className={'rv-red'}
            style={{
              fontSize: '0.9rem',
              // color: `${RED}`,
            }}
          />
        )}
        <H6
          // className={validator ? 'rv-default' : 'rv-distant'}
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
    <CollapseAnimate style={{ marginBottom: '1rem' }} isVisible={isVisible}>
      <Container>
        {passwordPolicy?.NewCharacters && resetingPass && (
          <ValidatorItems
            text={RVDic.PasswordPolicyNewCharacters.replace(
              '[n]',
              passwordPolicy?.NewCharacters
            )}
            validator={
              PasswordValidator(password, passwordPolicy)?.NewCharacters
            }
          />
        )}
        {passwordPolicy?.NonAlphaNumeric && (
          <ValidatorItems
            text={RVDic.PasswordPolicyNonAlphaNumeric}
            validator={
              PasswordValidator(password, passwordPolicy)?.NonAlphaNumeric
            }
          />
        )}
        {passwordPolicy?.Number && (
          <ValidatorItems
            text={RVDic.PasswordPolicyNumber}
            validator={PasswordValidator(password, passwordPolicy)?.Number}
          />
        )}
        {passwordPolicy?.MinLength && (
          <ValidatorItems
            text={RVDic.PasswordPolicyMinLength.replace(
              '[n]',
              passwordPolicy?.MinLength
            )}
            validator={PasswordValidator(password, passwordPolicy)?.MinLength}
          />
        )}
        {passwordPolicy?.NonAlphabetic && (
          <ValidatorItems
            text={RVDic.PasswordPolicyNonAlphabetic}
            validator={
              PasswordValidator(password, passwordPolicy)?.NonAlphabetic
            }
          />
        )}
        {passwordPolicy?.UpperLower && (
          <ValidatorItems
            text={RVDic.PasswordPolicyUpperLower}
            validator={PasswordValidator(password, passwordPolicy)?.UpperLower}
          />
        )}
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

  margin: 3px 0px 3px 3px;
  padding: 3px 0px 3px 3px;
`;

export const CollapseAnimate = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  max-height: ${({ isVisible }) => (isVisible ? '15%' : '0')};
  min-height: ${({ isVisible }) => (isVisible ? '0%' : '0%')};
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
  transition: max-height 0.1s, opacity 1s, min-height 1s;
`;
