/**
 * A simple loader component
 */
import React from 'react';
import styled, { keyframes } from 'styled-components';

const Loader = () => {
  return <Container />;
};
export default Loader;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Container = styled.div`
  border: 2px solid #f3f3f3; /* Light grey */
  border-top: 2px solid #3498db; /* Blue */
  border-radius: 60%;
  width: 23px;
  height: 23px;
  animation: ${rotate} 2s linear infinite;
`;
