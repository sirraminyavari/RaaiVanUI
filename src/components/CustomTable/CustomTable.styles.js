import { BO_DISTANT, C_GRAY } from 'constant/Colors';
import { BO_RADIUS_UNIT, IGNORE_RADIUS_BOTTOM } from 'constant/constants';
import {
  CV_BLACK,
  CV_DISTANT,
  CV_FREEZED,
  CV_GRAY,
  CV_WHITE,
} from 'constant/CssVariables';
import { FLEX_RCC, FLEX_RCS } from 'constant/StyledCommonCss';
import styled from 'styled-components';

const { RV_RevFloat } = window;

export const TableContainer = styled.div`
  padding: 1rem;
  display: block;
  margin: 1rem;
  border: 0.15rem solid black;

  .footer {
    .footer-tr:first-child {
      .footer-td {
        border-top: 2px solid black;
        min-height: 3rem;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 0.5rem;
      }
    }
    font-weight: bolder;
    text-align: center;
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
  // color: ${({ isDragging }) => (isDragging ? CV_WHITE : '')};

  &:hover {
    background-color: ${CV_FREEZED};
    color: ${CV_BLACK};
  }

  &:last-child {
    .td {
      border-bottom: 0;
    }
  }
`;

export const Table = styled.div.attrs({
  className: `${BO_DISTANT} ${BO_RADIUS_UNIT} ${IGNORE_RADIUS_BOTTOM}`,
})`
  border-spacing: 0;
  overflow-x: auto;
  margin: 0.5rem 0;
  user-select: none;
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
  border-bottom: 1px solid ${CV_DISTANT};
  border-right: 1px solid ${CV_DISTANT};
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
  right: -0.11rem;
  top: 0;
  // transform: translateX(-50%);
  z-index: 1;
  //! prevents from scrolling while dragging on touch devices
  touch-action: none;
  ${({ isResizing }) => isResizing && 'background: black;'}
`;

export const TableCell = styled.div.attrs({
  className: ``,
})`
  margin: 0;
  padding: 0.5rem;
  text-align: center;
  position: relative;
  border-top: 1px solid ${CV_DISTANT};
  // border-bottom: 1px solid ${CV_DISTANT};
  border-right: 1px solid ${CV_DISTANT};
  // border-left: 1px solid ${CV_DISTANT};

  :first-child {
    border-right: 0;
  }

  :last-child {
    border-left: 0;
  }
`;

export const TablePaginationContainer = styled.div`
  padding: 0.5rem;
  ${FLEX_RCS}
`;

export const PaginationArrowWrapper = styled.div`
  ${FLEX_RCC}
`;
