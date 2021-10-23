import styled from 'styled-components';

export const Select = styled.div.attrs({
  className: 'react-select-container',
})`
  border: 0.04rem solid var(--rv-color-distant);
  border-radius: 0.3rem;
  height: 3rem;

  :hover {
    border-color: var(--rv-color);
  }
`;
