import styled, { css } from 'styled-components';
import {
  CV_BLACK,
  CV_RED,
  CV_WHITE,
  TCV_DEFAULT,
  TCV_VERYWARM,
} from 'constant/CssVariables';
import { FLEX_RCB, FLEX_RCS } from 'constant/StyledCommonCss';
import { BG_GRAY_LIGHT, C_DISTANT, C_GRAY } from 'constant/Colors';
import { BO_RADIUS_HALF, IGNORE_RADIUS_LEFT } from 'constant/constants';
import Heading from 'components/Heading/Heading';

const { RV_Float, RV_RevFloat } = window;

const getScrollCss = (dir = RV_Float) => css`
  .ps__thumb-y {
    background-color: ${CV_BLACK} !important;
  }
  .ps__rail-y:hover {
    background-color: transparent !important;
  }
  .ps__rail-y {
    ${dir}: 0rem !important;
  }
`;

export const TemplateSelectContainer = styled.div`
  user-select: none;

  .select-template-modal-title-container {
    display: none;
  }

  .select-template-modal-content {
    margin-top: 2rem;
    height: calc(100% - 6.3rem);
  }
`;

export const ModalContentWrapper = styled.div`
  ${FLEX_RCB}
  color: ${CV_BLACK};
  margin: -1rem;
  height: calc(100vh - 5rem);
`;

export const TemplatesListContainer = styled.div.attrs({
  className: `${BG_GRAY_LIGHT} ${BO_RADIUS_HALF} ${IGNORE_RADIUS_LEFT}`,
})`
  width: 25%;
  padding: 1rem;
  height: calc(100% - 1rem);

  .template-list-scrollbar {
    max-height: calc(100vh - 9.5rem);
    margin-${RV_Float}: -1rem;
    padding-${RV_Float}: 1.3rem;
    margin-top: 1rem;
  }

  ${getScrollCss()}
`;

export const TemplateFieldsContainer = styled.div`
  width: 75%;
  height: 100%;
  padding: 1rem;
  position: relative;

  .template-select-button {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    width: 10rem;
    height: 2rem;
  }

  .template-back-button {
    position: absolute;
    top: 1rem;
    left: 1rem;
    width: 6rem;
    height: 1.7rem;
    background: transparent;
    border-color: ${CV_WHITE};
    border-radius: 1rem;

    :hover {
      border-color: ${CV_RED};
    }
  }

  .template-fields-scrollbar {
    max-height: calc(100% - 6rem);
    overflow: hidden;
  }

  ${getScrollCss(RV_RevFloat)}
`;

export const TemplateListTitle = styled.div.attrs({
  className: `${C_DISTANT}`,
})`
  font-size: 0.9rem;
  font-weight: 500;
`;

export const TemplateItemWrapper = styled.div.attrs({
  className: `${C_GRAY}`,
})`
  width: ${({ indentStep }) => `calc(100% - ${indentStep}px)`};
  margin-${RV_Float}: ${({ indentStep }) => `${indentStep}px`};
  ${FLEX_RCS}
  padding: 0.3rem 0;
  cursor: pointer;
`;

export const TemplateIconWrapper = styled.span`
  color: ${({ isExpanded }) => (isExpanded ? TCV_DEFAULT : '')};
`;

export const TemplateItemTitle = styled.span`
  margin-${RV_Float}: 0.2rem;
  ${({ isSelected }) =>
    isSelected &&
    `
      color: ${TCV_VERYWARM};
      font-weight: 500;
  `}
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const FieldCellContainer = styled.div.attrs({
  className: `${C_GRAY}`,
})`
  ${FLEX_RCS}
  gap: 1rem;
  height: 2rem;
  width: 100%;
  margin: 0.2rem 0;
`;

export const CurrentTemplateName = styled(Heading)`
  color: ${TCV_VERYWARM} !important;
  margin-bottom: 1rem;
  padding-top: 0.5rem;
`;
