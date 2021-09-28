import Button from 'components/Buttons/Button';
import styled from 'styled-components';
import { C_DISTANT } from 'constant/Colors';
import { CV_DISTANT, CV_RED } from 'constant/CssVariables';
import { FLEX_RCB, FLEX_RCC } from 'constant/StyledCommonCss';

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

export const RelatedTopicsContainer = styled.div`
  ${FLEX_RCB}
  gap: 1rem;
`;

export const RelatedTopicsTitle = styled.div.attrs({
  className: `${C_DISTANT}`,
})`
  padding: 0 1rem;
  border-left: 1px solid ${CV_DISTANT};
  min-width: 8rem;
  height: 2rem;
  ${FLEX_RCC}
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
  align-items: center;
  width: 100%;
  padding: 0 2rem 0 2rem;
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
export const Profile = styled.img`
  max-width: 3rem;
  max-height: 3rem;
  border-radius: 1.5rem;
  display: block;
  width: auto;
  height: auto;
  background-color: grey;
`;
export const ViewCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${CV_DISTANT};
  margin: 0 2.5rem 0 2.5rem;
`;
export const CounterBookmarkContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Space = styled.div`
  display: flex;
  flex-grow: 1;
`;
