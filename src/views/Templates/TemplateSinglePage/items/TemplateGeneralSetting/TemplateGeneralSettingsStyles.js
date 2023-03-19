import styled from 'styled-components';
import { CV_GRAY_LIGHT, CV_WHITE } from 'constant/CssVariables';
import { FLEX_CCC, FLEX_CSA, FLEX_RSS } from 'constant/StyledCommonCss';
import { MEDIUM_BOUNDRY, MOBILE_BOUNDRY } from 'constant/constants';

export const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 2rem;
  flex-direction: row;

  @media screen and (max-width: ${MEDIUM_BOUNDRY}) {
    flex-direction: column;
  }
`;
export const MainForm = styled.div`
  position: relative;
  border-radius: 0.625rem;
  box-shadow: 1px 5px 15px #0000001f;
  background-color: ${CV_GRAY_LIGHT};
  flex: 4.5;
  min-height: calc(100vh - 8rem);
  padding: 1.25rem 1.5rem 1.5rem 1.5rem;
  width: 100%;

  @media screen and (max-width: ${MEDIUM_BOUNDRY}) {
    flex: 1;
  }
`;

export const MainFormContainer = styled.div`
  ${FLEX_RSS};
  gap: 2.4rem;
  @media screen and (max-width: ${MOBILE_BOUNDRY}) {
    flex: 1;
    ${FLEX_CCC};
    flex-direction: column;
  }
`;

export const SideForm = styled.div`
  border-radius: 0.625rem;
  box-shadow: 1px 5px 15px #0000001f;
  flex-basis: 19.8rem;
  min-width: 19rem;
  min-height: calc(100vh - 8rem);
  overflow: hidden;
  background-color: ${CV_GRAY_LIGHT};
  padding-bottom: 1rem;
  z-index: 0;
  ${FLEX_CSA}
  flex: 1;
  width: 100%;

  @media screen and (max-width: ${MEDIUM_BOUNDRY}) {
    flex: 2;
    min-width: 9rem;
    flex-basis: 9rem;
  }
`;

export const Spacer = styled.div`
  flex: 1;
`;

export const SideFormHeader = styled.div`
  height: 3.8rem;
  width: 100%;
  ${FLEX_CCC};
  background-color: ${CV_WHITE};
  color: #002479;
  font-size: 18px;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding-block-end: 1rem;

  & > div:first-of-type {
    position: unset;
  }
`;
