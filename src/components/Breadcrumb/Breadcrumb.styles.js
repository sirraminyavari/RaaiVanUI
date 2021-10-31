import styled from 'styled-components';
import { C_DISTANT } from 'constant/Colors';
import { CV_DISTANT, CV_GRAY_DARK } from 'constant/CssVariables';
import { FLEX_RCC } from 'constant/StyledCommonCss';

export const BreadcrumbContainer = styled.div`
  position: absolute;
  ${({ dir }) => dir}: 2rem;
  top: 1rem;
  ${FLEX_RCC}
`;

export const BreadcrumbItem = styled.div.attrs({
  className: C_DISTANT,
})`
  display: inline-block;
  user-select: none;
  cursor: pointer;
  text-transform: capitalize;
  ${FLEX_RCC}
  & > div {
    color: ${CV_DISTANT};
  }

  :hover > * {
    color: ${CV_GRAY_DARK};
  }
`;
