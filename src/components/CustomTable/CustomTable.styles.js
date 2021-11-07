import styled, { css } from 'styled-components';
import { BG_DISTANT, BG_WHITE, C_GRAY, C_GRAY_DARK } from 'constant/Colors';
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
} from 'constant/CssVariables';
import {
  FLEX_CCC,
  FLEX_RCB,
  FLEX_RCC,
  FLEX_RCE,
  FLEX_RCS,
  HorizontalScrollbar,
} from 'constant/StyledCommonCss';
import {
  BO_RADIUS_CIRCLE,
  BO_RADIUS_HALF,
  BO_RADIUS_QUARTER,
} from 'constant/constants';
import Heading from 'components/Heading/Heading';

const { RV_RevFloat, RV_Float } = window;

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

export const TableContainer = styled.div.attrs({
  className: `${BO_RADIUS_HALF}`,
})`
  width: 100%;
  padding: 1rem 0;
  position: relative;
  box-shadow: 1px 3px 10px ${TCV_VERY_TRANSPARENT} !important;
  // border: 0.1rem solid #333;
`;

export const TableWrapper = styled.div`
  // border: 1px solid #333;
  overflow-x: scroll;
  margin-top: 3rem;
  ${HorizontalScrollbar}
`;

export const Table = styled.div`
  border-spacing: 0;
  margin: 0.5rem;
  margin-${RV_Float}: 0;
  user-select: none;

  [data-sticky-td] {
    position: fixed;
    ${RV_Float}: 0;
    background-color: ${CV_WHITE};
  }

  [data-sticky-last-left-td] {
    position: fixed;
    ${RV_Float}: 2.15rem;
    background-color: ${CV_WHITE};
    border-${RV_RevFloat}: 1px solid ${CV_DISTANT};
  }
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
  border-${RV_Float}: 1px solid ${CV_WHITE};

  //! Give border to last header.
  :last-child {
    border-${RV_RevFloat}: 1px solid ${CV_WHITE};
    border-top-${RV_RevFloat}-radius: 0.9rem !important;
  }

  :not(:first-child) {
    border-top: 1px solid ${CV_WHITE};
    background-color: ${CV_GRAY_LIGHT};
  }

  //! Hide first column border.
  :first-child {
    :first-child {
      border-${RV_Float}: 0;
    }

    //! Hide first column resizer.
    div:nth-child(2) {
      display: none !important;
    }
  }

  //! Give border radius to second one.
  :nth-child(2) {
    border-top-${RV_Float}-radius: 0.9rem !important;

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
  // background-color: ${({ isEditing }) => (isEditing ? CV_GRAY : '')};
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
      // background-color: ${({ isEditing }) => !isEditing && CV_FREEZED};
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

export const TableRowIndex = styled(Heading).attrs({
  className: `${C_GRAY}`,
})``;

export const TableColumnResizer = styled.div`
  display: inline-block;
  background: ${CV_GRAY};
  width: 0.25rem;
  height: 100%;
  border-radius: 15%;
  position: absolute;
  ${RV_Float}: -0.13rem;
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
  border-${RV_Float}: 1px solid ${CV_DISTANT};

  :hover:not(:first-child):not(:nth-child(2)) {
    div[data-edit-icon-wrapper] {
      opacity: 1 !important;
      transition: opacity 0.5s ease-in-out;
    }
  }

  :not(:first-child) {
    border-bottom: 1px solid ${CV_DISTANT};
  }

  :nth-child(1) {
    border-${RV_Float}: 0 !important;
    border-top: 0 !important;
  }

  :nth-child(2) {
    border-${RV_Float}: 0 !important;
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
  border: 0 !important;
`;

export const FooterTr = styled.div`
  position: relative;

  &:first-child {
    // border-left: 2px solid ${CV_GRAY_DARK};

    .footer-td {
      :not(:first-child) {
        border: 2px dashed ${CV_DISTANT};
        border-${RV_RevFloat}: 0;
      }

      :nth-child(1) {
        position: sticky;
        ${RV_Float}: 0rem;
        background-color: #fff;
        border: 0;
        z-index: 3000;
      }

      :nth-child(2) {
        position: sticky;
        ${RV_Float}: 2.2rem;
        background-color: #fff;
        border: 0;
        border-${RV_RevFloat}: 2px solid ${CV_DISTANT};
        z-index: 3000;
      }

      :nth-child(3) {
        border-${RV_Float}: 0;
      }

      min-height: 3rem;
      padding: 0 0.5rem;
      ${FLEX_RCC}
    }
  }
`;

export const TableActionsContainer = styled.div`
  position: absolute;
  width: 100%;
  padding: 0 1rem;
  ${FLEX_RCB}
`;

export const TableRowActionContainer = styled.div.attrs({
  className: `${BO_RADIUS_QUARTER} ${BG_WHITE}`,
})`
  position: absolute;
  ${RV_Float}: 4.35rem;
  width: 8rem;
  height: auto;
  max-height: 7rem;
  color: ${CV_GRAY_DARK};
  padding: 0.5rem;
  box-shadow: 1px 3px 10px ${TCV_VERY_TRANSPARENT} !important;
`;

export const EditActionContainer = styled.div`
  height: 100%;
  ${FLEX_CCC}

  .table-edit-check-icon {
    cursor: pointer;
    padding: 0.05rem;
    border-radius: 50%;

    :hover {
      background-color: ${TCV_VERY_TRANSPARENT};
    }
  }

  .table-edit-cancel-icon {
    cursor: pointer;
    padding: 0.4rem;
    border-radius: 50%;

    :hover {
      background-color: ${TCV_VERY_TRANSPARENT};
    }
  }
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
  text-transform: capitalize;

  :hover {
    background-color: ${CV_FREEZED};
  }
`;

export const TableActionIconWrapper = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  ${FLEX_CCC}
`;

export const RowDragHandleWrapper = styled.div`
  position: relative;
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
  user-select: none;
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
    ${RV_Float}: 2rem;
  }
`;

export const TableActionHeading = styled(Heading).attrs({
  className: `${C_GRAY_DARK}`,
})``;

const getDisplay = ({ isShown }) => {
  return isShown ? FLEX_CCC : 'display: none;';
};

export const EditIconWrapper = styled.div.attrs({
  className: `${BO_RADIUS_CIRCLE} ${BG_DISTANT}`,
})`
  ${getDisplay}
  width: 1.5rem;
  min-width: 1.5rem;
  height: 1.5rem;
  min-height: 1.5rem;
  position: absolute;
  top: 0.25rem;
  ${RV_RevFloat}: 0.25rem;
  opacity: 0;
  cursor: pointer;
`;

export const EditButtonsWrapper = styled.div`
  position: absolute;
  top: 0.25rem;
  ${RV_RevFloat} : 0.25rem;

  .table-edit-buttons-container {
    ${FLEX_RCC}
  }
`;
