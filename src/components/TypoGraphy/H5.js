/**
 * H5 text-box
 */
import { MAIN_BLUE } from 'constant/Colors';
import React from 'react';
import styled from 'styled-components';
/**
 * @param {ReactNode|ReactNodeArray} children - The computed children for this slot.
 * @param {object} props - Other params that don't include above.
 */
const H5 = ({ children, value, ...props }) => {
  return (
    <Container className="textarea" {...props}>
      {children}
    </Container>
  );
};
export default H5;

const Container = styled.div`
  font-size: 16px;
  text-align: right;
  color: ${MAIN_BLUE};
`;
