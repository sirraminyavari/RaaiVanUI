import React from 'react';
import styled from 'styled-components';

const Logo = () => {
  const { RVGlobal } = window;
  const isSaas = RVGlobal.SAASBasedMultiTenancy;

  return (
    <Container>
      <Image src={isSaas ? RVGlobal.LogoURL : RVGlobal.LogoMiniURL} />
    </Container>
  );
};
export default Logo;

const Container = styled.div`
  width: 50vw;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Image = styled.img`
  max-width: 50%;
  src: ${(props) => props.src};
  margin-bottom: 13px;
`;
