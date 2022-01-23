/**
 *  Wrapper component for ForgotPassword page
 */
import Heading from 'components/Heading/Heading';
import React from 'react';
import styled from 'styled-components';
import { Box } from '../AuthView.style';

const { RVDic } = window;
/**
 * In this page user can create an account with his/her mobile/email.
 */
const ForgotPasswordWrapper = ({ children } = {}) => {
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
          }}
          className={'rv-distant'}>
          {RVDic.ForgotMyPassword}
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
