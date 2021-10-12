import styled, { css } from 'styled-components';
import { BO_DISTANT } from 'constant/Colors';
import { BO_RADIUS_CIRCLE, BO_RADIUS_QUARTER } from 'constant/constants';
import {
  FLEX_CCC,
  FLEX_CSA,
  FLEX_RCB,
  FLEX_RCC,
  FLEX_RCS,
  FLEX_REB,
} from 'constant/StyledCommonCss';
import {
  CV_DISTANT,
  CV_RED,
  TCV_DEFAULT,
  TCV_VERYWARM,
} from 'constant/CssVariables';

export const NodeCellContainer = styled.div`
  width: 100%;
  ${FLEX_CSA}
  gap: 0.5rem;

  .table-node-cell-select-button {
    background-color: inherit;
    color: ${TCV_DEFAULT};
    width: 8rem;
    height: 1.8rem;
    border-radius: 1rem;
  }
`;

export const ItemsWrapper = styled.div`
  width: 100%;
  ${FLEX_REB}
  gap: 0.5rem;

  .table-node-cell-save-button {
    background-color: inherit;
    color: ${TCV_DEFAULT};
    padding: 0.3rem;
    height: 1.7rem;
    width: 7rem;
    border-radius: 1rem;
  }
`;

export const NodeListWrapper = styled.div`
  width: 100%;
  ${FLEX_CCC}
  gap: 0.2rem;
`;

export const NodeItemContainer = styled.div.attrs({
  className: `${BO_RADIUS_QUARTER} ${BO_DISTANT}`,
})`
  width: 100%;
  height: 2.5rem;
  max-height: 2.5rem;
  padding: 0 0.5rem;
  ${FLEX_RCB}
`;

export const NodeInfoWrapper = styled.div`
  width: ${({ editable }) => (editable ? '88%' : '100%')};
  height: 90%;
  margin-left: 0.2rem;
  ${FLEX_RCS}

  a:active {
    color: ${TCV_DEFAULT};
  }
`;

export const NodeLinkWrapper = styled.div`
  width: 100%;
  height: 100%;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 0.3rem;
  margin-right: 0.3rem;
  border-right: 1px solid ${CV_DISTANT};
  line-height: 2rem;

  a {
    color: ${TCV_VERYWARM};
  }
`;

export const CloseIconWrapper = styled.div.attrs({
  className: `${BO_RADIUS_CIRCLE}`,
})`
  cursor: pointer;
  padding: 0.2rem;
  ${FLEX_CCC}

  &:hover svg {
    color: ${CV_RED} !important;
  }
`;

export const AddNewNode = styled.div`
  ${FLEX_RCC}
  gap: 0.5rem;
  cursor: pointer;
`;

export const ItemSelectionButton = styled.div`
  ${FLEX_RCC}
  gap: 0.5rem;
`;
