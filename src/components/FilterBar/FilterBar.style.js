import Button from 'components/Buttons/Button';
import styled from 'styled-components';
import { C_DISTANT } from 'constant/Colors';

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
  /* :hover {
    border-width: 0.06rem;
    border-color: #bac9dc;
    border-style: solid;
  } */
`;
export const BottomRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
export const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  align-self: flex-end;
  margin: 1rem 1rem 1rem 0rem;
  justify-content: space-between;
`;
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding-left: 2rem;
  position: relative;
`;

export const BreadcrumbContainer = styled.div`
  position: absolute;
  right: 2rem;
  top: 1rem;
`;

export const BreadcrumbItem = styled.span.attrs({
  className: C_DISTANT,
})`
  padding: 0 0.2rem;
  display: inline-block;
  font-size: 0.9rem;
  user-select: none;

  :hover {
    color: #000;
  }
`;
