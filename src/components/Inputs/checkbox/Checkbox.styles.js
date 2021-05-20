import styled from 'styled-components';

export const CheckboxContainer = styled.div`
  input[type='checkbox']:checked + label {
    font-weight: bold;
  }
`;

export const CheckboxOptionsWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 0.5rem 0;
  user-select: none;
`;

export const CheckboxOptionsLabel = styled.label`
  margin: 0 0.5rem;
  cursor: pointer;
`;
