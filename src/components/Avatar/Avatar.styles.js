import styled from 'styled-components';

export const AvatarImage = styled.img`
  vertical-align: middle;
  width: ${(props) => `${props.radius}px`};
  height: ${(props) => `${props.radius}px`};
  border-radius: 50%;
`;

export const AvatarWrapper = styled.div`
  border-radius: 50%;
  padding: 0;
  margin-right: 25px;
  overflow: hidden;
  border: 2px solid #fff;
`;
