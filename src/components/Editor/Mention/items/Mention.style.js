import styled, { css, keyframes } from 'styled-components';

const { RV_RTL } = window;

const suggestionsAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
export const mentionSuggestions = styled.div`
  animation: ${suggestionsAnimation} 1s;
  border-style: solid;
  border-radius: 0.5rem;
  border-width: 0px;
  background-color: red;
  display: flex;
  flex-direction: column;
  box-shadow: 10px 10px;
`;
const itemAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
export const Suggestion = styled.div`
  animation: ${itemAnimation} 1s;
  display: inline-block;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  background-color: transparent;
  border-width: 0;
`;
export const SectionHeader = styled.div`
  color: grey;
  display: flex;
  align-self: flex-start;
  margin: 0.5rem;
  background-color: white;
`;
export const SectionBottom = styled.div`
  height: 1px;
  width: 13rem;
  background-color: rgb(237, 237, 236);
`;
export const SectionHeaderContainer = styled.div`
  width: 13rem;
  background-color: white;
  border-radius: 0.3rem;
`;
export const SuggestionContainer = styled.div`
  display: flex;
  flex-direction: row;
  animation: ${itemAnimation} 1s;
  align-items: center;
  justify-content: flex-start;
  background-color: ${({ isFocused }) =>
    isFocused ? 'rgb(239, 239, 239)' : 'white'};
  border-width: 0;
  width: 13rem;
  padding: 0.7rem 0rem 0.7rem 0rem;
  border-radius: 0.3rem;
  &:hover {
    background-color: rgb(239, 239, 239);
  }
  &:focus {
    background-color: rgb(239, 239, 239);
  }
`;
export const SuggestionAvatar = styled.img`
  height: 2rem;
  aspect-ratio: 1;
  border-radius: 1rem;
  margin: 0 0.5rem 0 0.5rem;
`;
export const SuggestionTitle = styled.div`
  padding: 0 1rem 0 1rem;
`;
