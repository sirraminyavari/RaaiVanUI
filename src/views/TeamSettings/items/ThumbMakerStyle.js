import styled from 'styled-components';

export const ThumbContainer = styled.div`
  width: 9rem;
  height: 9rem;
  position: relative;
  display: block;
  margin: auto;
`;

export const EditButton = styled.div.attrs({
  className: 'rv-bg-color-default ',
})`
  position: absolute;
  height: 2rem;
  width: 2rem;
  left: 0;
  bottom: 0;
  border-radius: 100%;
  border: white 0.12rem solid;
  cursor: pointer;
`;
