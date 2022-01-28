import {
  CV_RED,
  CV_RED_VERYSOFT,
  TCV_DEFAULT,
  TCV_VERY_TRANSPARENT,
} from 'constant/CssVariables';
import { FLEX_RCC } from 'constant/StyledCommonCss';
import styled from 'styled-components';

export const BadgeWrapper = styled.div`
  height: 1.5rem;
  width: 1.5rem;
  ${FLEX_RCC}
  border-radius: 50%;
  text-align: center;
  font-size: ${({ length }) => (length < 3 ? '60%' : '50%')};
  direction: rtl;
`;

export const PureBadge = styled.span.attrs({
  className: 'rv-border-radius-1',
})`
  padding-inline: 2rem;
  padding-block: 0.45rem;
  text-align: center;
  font-size: 0.7rem;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${({ type }) => {
    switch (type) {
      case 'default':
        return `color: ${TCV_DEFAULT};
  background-color: ${TCV_VERY_TRANSPARENT};`;
      case 'error':
        return `color: ${CV_RED};
  background-color: ${CV_RED_VERYSOFT};`;
    }
  }}
`;
