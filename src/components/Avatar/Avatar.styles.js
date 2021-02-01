import styled from 'styled-components';

export const AvatarWrapper = styled.div`
  display: flex;
  place-items: center;
  border-radius: 50%;
  margin-right: 25px;
  overflow: hidden;
  border: 2px solid #fff;
`;

export const AvatarImage = styled.img`
  width: ${({ radius }) => `${radius}px`};
  height: ${({ radius }) => `${radius}px`};
  border-radius: 50%;
`;
