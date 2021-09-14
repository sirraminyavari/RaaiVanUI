import styled, { css } from 'styled-components';

export const LogoContainer = styled.div`
  text-align: center;
`;

export const Image = styled.img`
  ${({ isSaaS }) =>
    isSaaS &&
    css`
      max-width: 5rem;
    `}
`;
