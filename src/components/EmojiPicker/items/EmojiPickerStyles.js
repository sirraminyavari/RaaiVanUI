import styled from 'styled-components';

export const Emoji = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  transition: all 0.15s ease-out;

  &:hover {
    transform: scale(1.2);
  }
`;
