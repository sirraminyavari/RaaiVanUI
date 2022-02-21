import styled from 'styled-components';
import {
  FLEX_CCC,
  FLEX_RCB,
  FLEX_RCE,
  FLEX_RSS,
} from 'constant/StyledCommonCss';
import { CV_DISTANT, TCV_DEFAULT } from 'constant/CssVariables';

export const TabViewContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  direction: ${(props) => (props?.rtl ? 'rtl' : 'ltr')};
`;
TabViewContainer.displayName = 'TabViewContainer';

export const TabHeader = styled.div`
  ${FLEX_RCB};
  border-bottom: 1px solid ${CV_DISTANT};
  height: ${({ height }) => height}rem;
`;
TabHeader.displayName = 'TabHeader';

export const TabItemContainer = styled.div`
  flex-grow: 1;
`;
TabItemContainer.displayName = 'TabItemContainer';

export const TabViewItem = styled.div`
  padding: 0 0.6rem;
  height: 100%;
  ${FLEX_CCC};
  color: ${({ highlight }) => (highlight ? TCV_DEFAULT : CV_DISTANT)};
  cursor: pointer;
  min-width: 3.5rem;
  font-size: 1rem;
  user-select: none;
  transition: all 300ms ease-out;
`;
TabViewItem.displayName = 'TabViewItem';

export const Items = styled.div`
  ${FLEX_RSS};
  flex-grow: 1;
  height: calc(${({ height }) => height}rem - 0.2rem);
`;
Items.displayName = 'Items';

export const IndicatorContainer = styled.div`
  position: relative;
`;
IndicatorContainer.displayName = 'IndicatorContainer';

export const Indicator = styled.div`
  position: absolute;
  left: ${({ offset }) => offset}rem;
  bottom: -1px;
  height: 0.25rem;
  border-radius: 0.25rem 0.25rem 0 0;
  background-color: ${TCV_DEFAULT};
  width: ${({ width }) => width / 16}rem;
  transition: all 300ms ease-out;
`;
Indicator.displayName = 'Indicator';

export const TabBody = styled.div`
  padding: 0.5rem 1rem;
`;
TabBody.displayName = 'TabBody';

export const ActionContainer = styled.div`
  ${FLEX_RCE};
  padding-left: 0.75rem;
`;
ActionContainer.displayName = 'ActionContainer';
