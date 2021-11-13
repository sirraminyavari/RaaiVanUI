import styled from 'styled-components';

export const CustomInputContainer = styled.div`
  width: 100%;
`;
export const CustomInput = styled.input`
  display: block;
  margin: 1.5rem auto 1.5rem auto;
  outline: none;
  border: none;
  border-bottom: var(--rv-color-distant) 0.05rem solid;
  text-align: center;
  height: ${({ light }) => (!light ? '3rem' : '2rem')};
  width: 14rem;
  font-size: ${({ light }) => (!light ? '1.75rem' : '1.12rem')};
  ${({ light }) => !light && 'font-weight: bolder;'}
  color: ${({ light }) =>
    !light ? 'var(--rv-gray-color-dark)' : 'var(--rv-gray-color)'};

  &::placeholder {
    ${({ light }) => !light && 'font-weight: bolder;'}
    font-size: ${({ light }) => (!light ? '1.75rem' : '1.12rem')};
    text-align: center;
    color: ${({ light }) =>
      !light ? 'var(--rv-gray-color-dark)' : 'var(--rv-gray-color)'};
  }
`;
