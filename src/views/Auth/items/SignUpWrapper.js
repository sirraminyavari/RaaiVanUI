/**
 *  Wrapper component for SignUp page
 */
import Heading from 'components/Heading/Heading';
import React from 'react';
import styled from 'styled-components';
import { Box } from '../AuthView.style';

const { RVDic } = window;
/**
 * In this page user can create an account with his/her mobile/email.
 */
const SignUpWrapper = ({ children } = {}) => {
  return (
    <Box>
      <Container>
        <Heading
          type="h5"
          style={{
            marginTop: '2rem',
            marginBottom: '2rem',
            textAlign: 'center',
          }}
          className={'rv-distant'}>
          {RVDic.CreateAccount}
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
