import { MAIN_BLUE } from 'const/Colors';
import React from 'react';
import styled from 'styled-components';

const H5 = ({ children, value, ...props }) => {
  return <Container {...props}>{children}</Container>;
};
export default H5;

const Container = styled.h5`
  font-size: 16px;
  text-align: right;
  color: ${MAIN_BLUE};
`;
