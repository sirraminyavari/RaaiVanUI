/**
 * Shown logo in the Login page of the project.
 */
import React from 'react';
import styled from 'styled-components';

const Logo = () => {
  // Access to logo src.
  const { RVGlobal } = window;
  // Defines project is enterprise or not.
  const isSaas = RVGlobal.SAASBasedMultiTenancy;

  return (
    <Container>
      <Image src={isSaas ? RVGlobal.LogoURL : RVGlobal.LogoMiniURL} />
    </Container>
  );
};
export default Logo;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5rem;
`;
const Image = styled.img`
  src: ${(props) => props.src};
  margin-bottom: 13px;
  align-self: center;
`;
