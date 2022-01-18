import { TC_DEFAULT } from 'constant/Colors';
import styled from 'styled-components';

export const SelectWrapper = styled.div`
  margin: 0.7rem;
  display: ${({ isShown }) => (isShown ? 'block' : 'none')};
`;

export const SelectLabel = styled.label.attrs({
  className: `${TC_DEFAULT}`,
})`
  width: auto;
  display: inline-block;
  margin: 0.5rem 0;
  font-size: 1rem;
`;
