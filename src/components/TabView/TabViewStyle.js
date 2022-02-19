import styled from 'styled-components';
import { FLEX_RCB, FLEX_RSS } from 'constant/StyledCommonCss';
import { CV_DISTANT } from '../../constant/CssVariables';

export const TabViewContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
`;

export const TabHeader = styled.div`
  ${FLEX_RCB};
  border-bottom: 1px solid ${CV_DISTANT};
  height: ${({ height }) => height};
`;

export const TabItemContainer = styled.div`
  ${FLEX_RSS};
  flex-grow: 1;
`;

export const Items = styled.div`
  ${FLEX_RSS};
  flex-grow: 1;
`;

export const IndicatorContainer = styled.div``;

export const Indicator = styled.div``;

export const TabBody = styled.div``;
