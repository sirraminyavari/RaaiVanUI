import Button from 'components/Buttons/Button';
import styled from 'styled-components';
import { C_DISTANT } from 'constant/Colors';
import { CV_DISTANT, CV_RED } from 'constant/CssVariables';

export const ShadowButton = styled(Button)`
  box-shadow: ${({ $isEnabled }) => $isEnabled && `1px 3px 20px ${CV_DISTANT}`};
  border-radius: 100rem;
  background-color: white;
  border-width: 0.06rem;
  padding: 0.5rem;
  /* border-color: ${({ $isEnabled }) => ($isEnabled ? '#BAC9DC' : 'white')}; */
  border-style: solid;
  transition: border-color 0.5s, box-shadow 0.5s;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  /* color: ${({ $isEnabled }) => ($isEnabled ? '#2B7BE4' : '#BAC9DC')}; */
  /* :hover {
    border-width: 0.06rem;
    border-color: #bac9dc;
    border-style: solid;
  } */
  /* ${({ $isEnabled }) => $isEnabled && 'rv-border-warm-red'} */
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
  padding-block: 3rem 1rem;
  // padding-inline: 1rem;
  justify-content: space-between;
`;
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-inline: 2.2rem;
  position: relative;
`;

export const BreadcrumbContainer = styled.div`
  position: absolute;
  ${({ dir }) => dir}: 2rem;
  top: 1rem;
`;

export const BreadcrumbItem = styled.span.attrs({
  className: C_DISTANT,
})`
  padding: 0 0.2rem;
  display: inline-block;
  font-size: 0.9rem;
  user-select: none;
  cursor: pointer;

  :hover {
    color: #000;
  }
`;

export const BackButton = styled(Button)`
  :hover {
    border-width: 0.05rem;
    border-style: solid;
    border-color: ${CV_RED};
    padding: 0.5rem;
  }
`;
