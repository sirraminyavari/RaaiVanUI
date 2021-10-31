import styled from 'styled-components';

export const AvatarContainer = styled.div`
  display: flex;
  place-items: center;
  border-radius: 50%;
  overflow: hidden;
  color: #fff;
  border: 0.15rem solid ${({ color }) => (!!color ? color : '#fff')};
`;

export const AvatarImage = styled.img`
  width: ${({ radius }) => (!!radius ? `${radius}px` : '100%')};
  height: ${({ radius }) => (!!radius ? `${radius}px` : '100%')};
  border-radius: 50%;
`;

export const AvatarIconWrapper = styled.div`
  display: flex;
  place-items: center;
`;
