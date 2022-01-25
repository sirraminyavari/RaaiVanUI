/**
 *  Wrapper component for ForgotPassword page
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
const ForgotPasswordWrapper = ({ codeMode, onCodeCancel, children } = {}) => {
  return (
    <Box>
      <Container>
        <Heading
          type="h5"
          style={{
            textAlign: 'center',
            marginBottom: '0.75rem',
            marginTop: '0.75rem',
            fontSize: '0.8rem',
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
          {codeMode ? RVDic.VerificationCode : RVDic.ForgotMyPassword}
        </Heading>
        {children}
      </Container>
    </Box>
  );
};

export default ForgotPasswordWrapper;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  align-items: center;
  justify-content: center;
  padding-top: 1rem;
`;
