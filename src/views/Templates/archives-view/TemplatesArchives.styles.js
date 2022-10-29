import styled from 'styled-components';
import { BG_GRAY_LIGHT, TC_WARM } from 'constant/Colors';
import { BO_RADIUS_UNIT } from 'constant/constants';
import { CV_RED, CV_WHITE } from 'constant/CssVariables';

const { RV_Float } = window;

export const TemplatesViewContainer = styled.div.attrs({
  className: `${BG_GRAY_LIGHT} ${BO_RADIUS_UNIT}`,
})`
  position: relative;
  min-height: calc(100vh - 5.5rem);
  box-shadow: 1px 5px 15px #0000001f;
  margin: 1rem;
  padding: 1rem;
  padding-top: 1.5rem;
  user-select: none;
`;

export const TemplatesViewTitle = styled.div.attrs({
  className: `${TC_WARM}`,
})`
  font-size: 1.1rem;
  font-weight: bold;
`;

export const TemplatesViewBreadcrumbContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding-block-end: 1rem;
  padding-block-start: 1rem;

  .templates-breadcrumb {
    // ${RV_Float}: 1rem;
    position: unset;
  }
`;
