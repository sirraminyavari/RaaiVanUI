import styled from 'styled-components';

export const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  align-items: center;
`;

export const Image = styled.img`
  width: ${({ size }) => `${size}rem`};
`;
