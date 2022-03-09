import styled from 'styled-components';
import { CV_GRAY, CV_WHITE } from 'constant/CssVariables';
import { FLEX_RCB, FLEX_RSB } from 'constant/StyledCommonCss';

export const Container = styled.div`
  direction: ${({ rtl }) => (rtl ? 'rtl' : 'ltr')};
`;

export const ActionHeader = styled.div`
  ${FLEX_RCB};
  width: 110%;
  height: 6rem;
  background-color: ${CV_WHITE};
  gap: 1rem;
  padding: 1.5rem 1.5rem 1.5rem calc(10% + 1.5rem);
  box-shadow: 1px 3px 5px #0000001a;
  transform: translate(${({ rtl }) => (rtl ? 1 : -1)}rem, -2rem);
  z-index: 2;
`;

export const HeaderTitle = styled.h2`
  color: ${CV_GRAY};
  font-weight: 400;
  padding: 0;
  margin: 0;
`;

export const Spacer = styled.div`
  flex: 1;
`;

export const ButtonTitle = styled.span`
  margin: 0 0.5rem;
`;

export const MainContent = styled.div`
  min-height: calc(100vh - 12rem);
  width: 100%;
  ${FLEX_RSB};
`;

export const FormElementListPanel = styled.div`
  height: calc(100vh - 12rem);
  width: 18rem;
  background-color: ${CV_WHITE};
  box-shadow: 1px 5px 30px #0000001f;
  transform: translate(1rem, -2rem);
  z-index: 1;
`;
