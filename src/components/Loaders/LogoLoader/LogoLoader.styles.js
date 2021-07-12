import styled, { css } from 'styled-components';

export const LogoContainer = styled.div`
  width: 2rem;
  margin: 0.5rem auto;
  text-align: center;
`;

export const Image = styled.img`
  ${({ isSaaS }) =>
    isSaaS &&
    css`
      max-width: 2rem;
    `}
`;
