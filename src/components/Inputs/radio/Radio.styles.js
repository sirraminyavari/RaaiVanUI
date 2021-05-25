import styled from 'styled-components';

export const RadioContainer = styled.div`
  width: 100%;
`;

export const RadioOptionWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0.3rem 0;

  input[type='radio']:checked + label {
    font-weight: bold;
  }
`;

export const RadioLabel = styled.label`
  margin: 0 0.5rem;
  cursor: pointer;
`;
