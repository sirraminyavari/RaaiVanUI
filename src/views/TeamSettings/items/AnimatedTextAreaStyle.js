import styled from 'styled-components';

export const TextAreaWrapper = styled.div`
  width: 100%;
  position: relative;
`;

export const TextAreaLabel = styled.label`
  position: absolute;
  top: 1rem;
  ${({ rtl }) => (rtl ? 'right: 1rem' : 'left: 1rem')};
  width: fit-content;
  cursor: text;
  color: var(--rv-gray-color);
  transition: all 0.2s ease-in;
`;

export const TextAreaInput = styled.textarea`
  display: block;
  position: absolute;
  top: 0;
  ${({ rtl }) => (rtl ? 'right: 0' : 'left: 0')};
  width: 100%;
  border: 0.04rem solid var(--rv-color-distant);
  border-radius: 0.3rem;
  outline: none;
  padding: 1rem;
  font-size: 0.8rem;
  color: var(--rv-gray-color);
  height: 6rem;

  &:focus {
    border-color: var(--rv-color);
  }

  &:focus
    ~ ${TextAreaLabel},
    &:not(:placeholder-shown):not(:focus)
    ~ ${TextAreaLabel} {
    top: -0.55rem;
    ${({ rtl }) => (rtl ? 'right: 1.25rem' : 'left: 1.25rem')};
    font-size: 0.75rem;
    background-color: white;
    padding: 0 0.2rem;
    color: var(--rv-gray-color-dark);
  }
`;
