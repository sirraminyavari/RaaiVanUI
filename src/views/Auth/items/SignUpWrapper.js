/**
 *  Wrapper component for SignUp page
 */
import Heading from 'components/Heading/Heading';
import ArrowIcon from 'components/Icons/ArrowIcons/Arrow';
import React from 'react';
import styled from 'styled-components';
import { Box } from '../AuthView.style';

const { RVDic, RV_RTL } = window;
/**
 * In this page user can create an account with his/her mobile/email.
 */
const SignUpWrapper = ({ codeMode, onCodeCancel, children } = {}) => {
  return (
    <Box>
      <Container>
        <Heading
          type="h5"
          style={{
            marginTop: '2rem',
            marginBottom: '2rem',
            textAlign: 'center',
            position: 'relative',
            width: '100%',
          }}
          className={'rv-distant'}>
          {codeMode && (
            <ArrowIcon
              dir={RV_RTL ? 'right' : 'left'}
              style={{
                marginInlineEnd: '0.5rem',
                fontWeight: 'bold',
                position: 'absolute',
                [RV_RTL ? 'right' : 'left']: 0,
                top: '0.3rem',
                fontSize: '1.2rem',
                cursor: 'pointer',
              }}
              onClick={onCodeCancel}
            />
          )}
          {codeMode ? RVDic.VerificationCode : RVDic.CreateAccount}
        </Heading>
        {children}
      </Container>
    </Box>
  );
};

export default SignUpWrapper;

export const common_style = {
  marginBottom: '0.75rem',
  marginTop: '0.75rem',
  fontSize: '0.8rem',
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80%;
  height: 100%;
`;
