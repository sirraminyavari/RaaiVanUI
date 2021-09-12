import styled from 'styled-components';
import { C_GRAY } from 'constant/Colors';
import {
  CV_BLACK,
  CV_DISTANT,
  CV_FREEZED,
  CV_GRAY,
  CV_GRAY_DARK,
  CV_RED,
  CV_WHITE,
  TCV_VERY_TRANSPARENT,
  TCV_VERY_TRANSPARENT_WARM,
} from 'constant/CssVariables';
import { FLEX_CCC, FLEX_RCC, FLEX_RCS } from 'constant/StyledCommonCss';
import { BO_RADIUS_QUARTER } from 'constant/constants';

const { RV_RevFloat } = window;

export const TableContainer = styled.div`
  padding: 1rem 0;
  // margin: 1rem;
  border: 0.15rem solid black;
  overflow-x: auto;
`;

export const Table = styled.div`
  border-spacing: 0;
  margin: 0.5rem;
  user-select: none;
`;

export const TableBody = styled.div`
  min-height: 2rem;
`;

export const TableHeader = styled.div.attrs({
  className: `${C_GRAY}`,
})`
  font-size: 1rem;
  margin: 0;
  padding: 0.5rem;
  text-align: center;
  position: relative;
  border-right: 1px solid ${CV_DISTANT};

  //! Give border to last header.
  :last-child {
    border-left: 1px solid ${CV_DISTANT};
    border-top-left-radius: 0.9rem !important;
  }

  :not(:first-child) {
    border-top: 1px solid ${CV_DISTANT};
    border-bottom: 1px solid ${CV_DISTANT};
  }

  //! Hide first column border.
  :first-child {
    :first-child {
      border-right: 0;
    }

    //! Hide first column resizer.
    div:nth-child(2) {
      display: none !important;
    }
  }

  //! Give border radius to second one.
  :nth-child(2) {
    border-top-right-radius: 0.9rem !important;

    //! Hide second column resizer.
    div:nth-child(2) {
      display: none !important;
    }
  }
`;

export const HeaderWrapper = styled.div`
  ${FLEX_RCC}

  .table-sort-arrow {
    position: absolute;
    ${RV_RevFloat}: 0.3rem;
  }
`;

export const Tr = styled.div`
  background-color: ${({ isDragging }) => (isDragging ? CV_FREEZED : '')};
  border-left: 1px solid ${CV_DISTANT};

  :last-child {
    > div:not(:first-child) {
      border-bottom: 1px solid ${CV_DISTANT};
    }
  }

  &:hover {
    > div:not(:first-child) {
      background-color: ${CV_FREEZED};
      color: ${CV_BLACK};
    }
  }

  .table-row-action-tooltip {
    background-color: ${CV_WHITE} !important;
    opacity: 1 !important;
    box-shadow: 1px 3px 20px ${TCV_VERY_TRANSPARENT} !important;
    padding: 0 !important;
  }
`;

export const TableRowIndex = styled.span`
  font-size: 1rem;
`;

export const TableColumnResizer = styled.div`
  display: inline-block;
  background: ${CV_GRAY};
  width: 0.25rem;
  height: 100%;
  border-radius: 15%;
  position: absolute;
  right: -0.13rem;
  top: 0;
  // transform: translateX(-50%);
  // z-index: 1;
  //! prevents from scrolling while dragging on touch devices
  touch-action: none;
  ${({ isResizing }) => isResizing && 'background: black;'}
`;

export const TableCell = styled.div`
  ${FLEX_RCC}
  margin: 0;
  padding: 0.5rem;
  text-align: center;
  position: relative;
  border-top: 1px solid ${CV_DISTANT};
  // border-bottom: 1px solid ${CV_DISTANT};
  border-right: 1px solid ${CV_DISTANT};
  // border-left: 1px solid ${CV_DISTANT};

  :nth-child(1) {
    border-right: 0 !important;
    border-top: 0 !important;
  }
`;

export const TablePaginationContainer = styled.div`
  padding: 0.5rem;
  ${FLEX_RCS}
`;

export const PaginationArrowWrapper = styled.div`
  ${FLEX_RCC}
`;

export const FooterContainer = styled.div`
  font-weight: bolder;
  text-align: center;
`;

export const FooterTr = styled.div`
  position: relative;

  &:first-child {
    border-left: 2px solid ${CV_GRAY_DARK};

    .footer-td {
      :not(:first-child) {
        border: 2px solid ${CV_GRAY_DARK};
        border-left: 0;
      }

      min-height: 3rem;
      padding: 0 0.5rem;
      ${FLEX_RCC}
    }
  }
`;

export const RowDragHandle = styled.div`
  // position: absolute;
  // right: -1.5rem;
  // top: 50%;
  // transform: translate(0, -50%);
`;

export const RowActionHandle = styled.div`
  position: absolute;
  left: -1.5rem;
  top: 50%;
  transform: translate(0, -50%);
  cursor: pointer;

  :hover svg {
    color: ${CV_RED} !important;
  }
`;

export const TableButtonsContainer = styled.div`
  .table-add-row-button {
    display: inline-block;
    margin: 0 0.5rem;
    width: 12rem;
    border-radius: 2rem;
  }
`;

export const TableRowActionContainer = styled.div`
  width: 6.5rem;
  height: auto;
  color: ${CV_GRAY_DARK};
  padding: 0.5rem;
`;

export const TableActionWrapper = styled.div.attrs({
  className: `${BO_RADIUS_QUARTER}`,
})`
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  margin: 0.1rem 0;
  ${FLEX_RCS}
  gap: 0.5rem;

  :hover {
    background-color: ${TCV_VERY_TRANSPARENT_WARM};
  }
`;

export const RowDragHandleWrapper = styled.div`
  cursor: pointer !important;
  width: 100%;
  height: calc(100% + 1rem);
  padding: 0.8rem;
  ${FLEX_CCC}
`;
