import styled, { css } from 'styled-components';
import { C_GRAY } from 'constant/Colors';
import {
  CV_BLACK,
  CV_DISTANT,
  CV_FREEZED,
  CV_GRAY,
  CV_GRAY_DARK,
  CV_GRAY_LIGHT,
  CV_RED,
  CV_WHITE,
  TCV_DEFAULT,
  TCV_VERY_TRANSPARENT,
  TCV_VERY_TRANSPARENT_WARM,
} from 'constant/CssVariables';
import {
  FLEX_CCC,
  FLEX_RCB,
  FLEX_RCC,
  FLEX_RCE,
  FLEX_RCS,
} from 'constant/StyledCommonCss';
import { BO_RADIUS_QUARTER } from 'constant/constants';

const { RV_RevFloat } = window;

export const selectStyles = {
  control: (styles) => ({
    ...styles,
    width: '4.5rem',
    height: '2rem',
    minHeight: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'inherit',
    borderColor: CV_DISTANT,
  }),
  option: (styles, { isSelected }) => ({
    ...styles,
    backgroundColor: isSelected && CV_DISTANT,
    width: '90%',
    margin: '0.3rem auto',
    borderRadius: '0.2rem',
    color: CV_BLACK,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: !isSelected && CV_FREEZED,
    },
    ':active': {
      ...styles[':active'],
      backgroundColor: isSelected && CV_DISTANT,
    },
  }),
  indicatorsContainer: (styles) => ({
    ...styles,
    svg: {
      color: TCV_DEFAULT,
    },
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    display: 'none',
  }),
  singleValue: (styles) => ({
    ...styles,
    padding: '0.2rem',
    fontSize: '1rem',
    borderRadius: '0.2rem',
    width: '75%',
    textAlign: 'center',
    color: TCV_DEFAULT,
  }),
  menu: (styles) => ({
    ...styles,
    width: '4.5rem',
    textAlign: 'center',
  }),
};

export const TableContainer = styled.div`
  padding: 1rem 0;
  position: relative;
  border: 0.1rem solid #333;
  // overflow-x: auto;
`;

export const Table = styled.div`
  border-spacing: 0;
  margin: 0.5rem;
  margin-right: 0;
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
  border-right: 1px solid ${CV_WHITE};

  //! Give border to last header.
  :last-child {
    border-left: 1px solid ${CV_WHITE};
    border-top-left-radius: 0.9rem !important;
  }

  :not(:first-child) {
    border-top: 1px solid ${CV_WHITE};
    background-color: ${CV_GRAY_LIGHT};
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
  ${FLEX_RCB}

  .table-sort-arrow {
    position: absolute;
    ${RV_RevFloat}: 0.3rem;
  }
`;

export const HeaderAsterisk = styled.span`
  color: ${CV_RED};
`;

export const Tr = styled.div`
  background-color: ${({ isDragging }) => (isDragging ? CV_FREEZED : '')};
  // :not(:first-child) {
  //   border-top: 1px solid ${CV_DISTANT};
  // }

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
  border-right: 1px solid ${CV_DISTANT};

  :not(:first-child) {
    border-bottom: 1px solid ${CV_DISTANT};
  }

  :nth-child(1) {
    border-right: 0 !important;
    border-top: 0 !important;
  }

  :nth-child(2) {
    border-right: 0 !important;
  }
`;

export const TablePaginationContainer = styled.div`
  user-select: none;
  padding: 0.5rem;
  ${FLEX_RCB}
`;

export const TablePaginationSelectWrapper = styled.div`
  ${FLEX_RCC}
`;

export const PaginationSelectTitle = styled.span`
  display: inline-block;
  font-size: 0.9rem;
  width: 12rem;
  color: ${CV_GRAY};
`;

export const PaginationArrowWrapper = styled.div`
  ${FLEX_RCC}
  gap: 0.5rem;
`;

export const PaginationSpan = styled.span`
  font-size: 1rem;
  color: ${CV_DISTANT};
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

export const TableActionsContainer = styled.div`
  position: absolute;
  width: 100%;
  padding: 0 1rem;
  ${FLEX_RCB}
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

export const TableSearchWrapper = styled.div`
  position: relative;
  width: 50%;

  :focus-within svg {
    color: ${TCV_DEFAULT} !important;
  }

  .table-search-icon {
    position: absolute;
    ${RV_RevFloat}: 0.5rem;
    top: 0.5rem;
  }
`;

export const TableButtonsWrapper = styled.div`
  width: 70%;
  ${FLEX_RCE}
`;

const commonActionBTNCss = css`
  display: inline-block;
  margin: 0 0.5rem;
  width: 10rem;
  height: 2rem;
  border-radius: 2rem;
  ${FLEX_RCC}
`;

const commonActionIconCss = css`
  position: absolute;
  top: 0.35rem;
  z-index: 500;
`;

export const ActionButton = styled.div`
  position: relative;
  cursor: pointer;

  .table-add-new-item-button {
    ${commonActionBTNCss}

    :hover {
      background-color: ${CV_WHITE};
    }
  }

  .table-select-item-button {
    ${commonActionBTNCss}
  }

  .table-add-new-item-icon {
    ${commonActionIconCss}
    right: 1.5rem;
  }

  .table-select-item-icon {
    ${commonActionIconCss}
    right: 2rem;
  }
`;
