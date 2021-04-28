import styled from 'styled-components';

export const AvatarContainer = styled.div`
  display: flex;
  place-items: center;
  border-radius: 50%;
  overflow: hidden;
  color: #fff;
  border: 0.2rem solid ${({ color }) => (!!color ? color : '#fff')};
`;

export const AvatarImage = styled.img`
  width: ${({ radius }) => `${radius}px`};
  height: ${({ radius }) => `${radius}px`};
  border-radius: 50%;
`;
