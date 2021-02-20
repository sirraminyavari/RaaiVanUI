/**
 * H3 text-box
 */
import React from 'react';
import styled from 'styled-components';
/**
 * @param {ReactNode|ReactNodeArray} children - The computed children for this slot.
 * @param {object} props - Other params that don't include above.
 */
const H3 = ({ children, ...props }) => {
  return (
    <Container className="textarea" {...props}>
      {children}
    </Container>
  );
};
export default H3;

const Container = styled.h3`
  font-size: 0.7rem;
  text-align: right;
`;
