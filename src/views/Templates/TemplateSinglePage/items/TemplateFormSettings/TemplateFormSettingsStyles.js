import styled from 'styled-components';
import {
  CV_DISTANT,
  CV_GRAY,
  CV_GRAY_DARK,
  CV_GRAY_LIGHT,
  CV_WHITE,
} from 'constant/CssVariables';
import {
  FLEX_CCC,
  FLEX_RCB,
  FLEX_RCS,
  FLEX_RSB,
} from 'constant/StyledCommonCss';

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
  min-height: calc(100vh - 13rem);
  width: 100%;
  ${FLEX_RSB};
`;

export const FormElementListPanel = styled.div`
  height: calc(100vh - 11.2rem);
  width: 18rem;
  background-color: ${CV_WHITE};
  box-shadow: 1px 5px 30px #0000001f;
  margin: -1.85rem -1rem 0 0;
  z-index: 1;
  padding: 0.5rem 1rem 0.5rem 0.5rem;
  overflow: scroll;
`;

export const FormPanel = styled.div`
  height: calc(100vh - 13rem);
  flex: 1;
  ${FLEX_RSB};
  gap: 1rem;
  padding: 0 1rem;
`;

export const FormElementList = styled.ul`
  padding: 0;
`;

export const FormElementListWrapper = styled.div`
  overflow: hidden;
  height: ${({ height }) => height}rem;
`;

export const FormBuilderLayout = styled.div`
  flex: 1;
  background-color: ${CV_WHITE};
  border-radius: 0.8rem;
  box-shadow: 1px 5px 20px #0000001f;
  height: calc(100vh - 13rem);
  position: relative;
  padding: 4rem 2rem;
`;

export const FormSetting = styled.div`
  width: 19rem;
  background-color: ${CV_WHITE};
  border-radius: 0.8rem;
  box-shadow: 1px 5px 20px #0000001f;
  min-height: 6rem;
`;

export const FormSettingTitle = styled.div`
  height: 3rem;
  line-height: 3rem;
  text-align: center;
  color: ${CV_GRAY};
  font-size: 1rem;
  background-color: ${CV_GRAY_LIGHT};
`;

export const FromElementGroupLabel = styled.div`
  font-size: 0.85rem;
  color: ${CV_GRAY};
  list-style-type: none;
  margin-bottom: 1rem;
`;

export const IconWrapper = styled.div`
  ${FLEX_CCC};
`;

export const FormElementItem = styled.li`
  ${FLEX_RCS};
  list-style-type: none;
  height: 3.5rem;
  user-select: none;
  padding: 1.4rem;
  gap: 1.5rem;
  border: 0.0625rem solid #e6f4f1;
  color: ${CV_GRAY_DARK};
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border 0.3s ease-out;
  background-color: ${CV_GRAY_LIGHT};

  &:hover {
    border: 0.0625rem solid ${CV_DISTANT};
  }
`;

export const Clone = styled(FormElementItem)`
  //+ div {
  //  display: none !important;
  //}
`;

export const DragPlaceholder = styled.div`
  height: 6rem;
  width: 100%;
  background-color: #2b7be40d;
  border-radius: 0.8rem;
`;
