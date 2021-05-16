import styled from 'styled-components';

//! Radio styles.
export const RadioContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: 1rem 0;
  color: #262261;
`;

export const RadioOptionWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0.3rem 0;

  input[type='radio']:checked + label {
    font-weight: bold;
  }
`;

export const RadioTitle = styled.div`
  margin: 0.5rem 0;
`;

export const RadioLabel = styled.label`
  margin: 0 0.5rem;
`;

//! AutoSuggest styles.
export const AutoSuggestContainer = styled.div`
  width: 100%;
  margin: 1rem 0;
`;

export const AutoSuggestTitle = styled.div``;
