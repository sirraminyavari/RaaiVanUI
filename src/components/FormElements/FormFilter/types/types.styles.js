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
  font-size: 1rem;
`;

export const RadioLabel = styled.label`
  margin: 0 0.5rem;
`;

//! AutoSuggest styles.
export const AutoSuggestContainer = styled.div`
  width: 100%;
  margin: 1rem 0;
`;
export const SuggestTitleWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const AutoSuggestTitle = styled.div`
  color: #262261;
  font-size: 1rem;
  margin: 0 0.5rem;
`;

//! Date styles
export const DateContainer = styled.div`
  width: 100%;
  margin-bottom: 1rem;
`;

export const DateTitle = styled.div`
  font-size: 1rem;
  color: #262261;
  margin: 1rem 0;
`;

export const DatePickerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
`;

export const DatePicker = styled.div`
  margin: auto;
`;

export const DateSpanTitle = styled.div`
  font-size: 1rem;
  color: #262261;
`;

//! Text styles
export const TextContainer = styled.div`
  width: 100%;
`;

export const TextTitle = styled.div`
  font-size: 1rem;
  color: #2b2727;
  margin: 1rem 0;
`;
