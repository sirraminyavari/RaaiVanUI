import { BO_DISTANT, C_GRAY } from 'constant/Colors';
import { BO_RADIUS_UNIT, IGNORE_RADIUS_BOTTOM } from 'constant/constants';
import {
  CV_BLACK,
  CV_DISTANT,
  CV_FREEZED,
  CV_GRAY,
  CV_GRAY_DARK,
  CV_RED,
  CV_WHITE,
} from 'constant/CssVariables';
import { FLEX_CCC, FLEX_RCC, FLEX_RCS } from 'constant/StyledCommonCss';
import styled from 'styled-components';

const { RV_RevFloat } = window;

export const TableContainer = styled.div`
  padding: 1rem 2rem;
  display: block;
  margin: 1rem;
  border: 0.15rem solid black;
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
`;

export const Table = styled.div.attrs({
  className: ``,
})`
  border-spacing: 0;
  //TODO: Big big problem.
  overflow-x: auto;
  margin: 0.5rem 0;
  user-select: none;
  border: 0;
`;

export const TableBody = styled.div.attrs({
  className: ``,
})`
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

export const TableColumnResizer = styled.div.attrs({
  className: ``,
})`
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

export const TableCell = styled.div.attrs({
  className: ``,
})`
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
