import styled from 'styled-components';
import { CV_GRAY_LIGHT, CV_WHITE } from 'constant/CssVariables';
import { FLEX_CCC, FLEX_RSS } from 'constant/StyledCommonCss';

export const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 2.5rem;
`;
export const MainForm = styled.div`
  position: relative;
  border-radius: 0.625rem;
  box-shadow: 1px 5px 15px #0000001f;
  background-color: ${CV_GRAY_LIGHT};
  flex: 1;
  min-height: calc(100vh - 8rem);
  padding: 5.25rem 1.5rem 1.5rem 1.5rem;
`;

export const MainFormContainer = styled.div`
  ${FLEX_RSS};
  gap: 2.4rem;
`;

export const SideForm = styled.div`
  border-radius: 0.625rem;
  box-shadow: 1px 5px 15px #0000001f;
  flex-basis: 23.8rem;
  min-height: calc(100vh - 8rem);
  overflow: hidden;
  background-color: ${CV_GRAY_LIGHT};
  position: relative;
`;

export const SideFormHeader = styled.div`
  height: 3.8rem;
  width: 100%;
  ${FLEX_CCC};
  background-color: ${CV_WHITE};
  color: #002479;
  font-size: 18px;
`;
