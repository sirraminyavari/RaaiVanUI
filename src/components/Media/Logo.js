/**
 * Shown logo in the Login page of the project.
 */
import React from 'react';
import styled from 'styled-components';
import cliqmind_logo_white from '../../assets/images/cliqmind_logo_white.svg';
import cliqmind_logo_white_en from '../../assets/images/cliqmind_logo_white_en.svg';
import useWindowContext from 'hooks/useWindowContext';

const Logo = () => {
  const { RV_Lang } = useWindowContext();
  // Access to logo src.
  // Defines project is enterprise or not.

  return (
    <Container href="https://cliqmind.com">
      {/* <Image src={isSaas ? RVGlobal.LogoURL : RVGlobal.LogoMiniURL} /> */}
      <Image
        src={RV_Lang === 'en' ? cliqmind_logo_white_en : cliqmind_logo_white}
      />
    </Container>
  );
};
export default Logo;

const Container = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5rem;
`;
const Image = styled.img`
  src: ${(props) => props.src};
  height: 3rem;
  aspect-ratio: auto;
`;
