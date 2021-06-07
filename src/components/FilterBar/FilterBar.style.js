import Button from 'components/Buttons/Button';
import styled from 'styled-components';

export const ShadowButton = styled(Button)`
  box-shadow: ${({ isEnabled }) => isEnabled && '1px 3px 20px #2b7be44d'};
  border-radius: 100rem;
  background-color: white;
  border-width: 0.06rem;
  padding: 0.5rem;
  border-color: ${({ isEnabled }) => (isEnabled ? '#BAC9DC' : 'white')};
  border-style: solid;
  transition: border-color 0.5s, box-shadow 0.5s;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: ${({ isEnabled }) => (isEnabled ? '#2B7BE4' : '#BAC9DC')};
  :hover {
    border-width: 0.06rem;
    border-color: #bac9dc;
    border-style: solid;
  }
`;
export const BottomRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
export const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  align-self: flex-end;
  min-height: 10rem;
  margin: 0 1rem 0 1rem;
`;
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-left: 2rem;
`;
