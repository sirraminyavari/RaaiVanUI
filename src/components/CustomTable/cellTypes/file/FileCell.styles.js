import styled from 'styled-components';
import { BO_DISTANT, TC_DEFAULT } from 'constant/Colors';
import { BO_RADIUS_QUARTER } from 'constant/constants';
import {
  FLEX_CCC,
  FLEX_RCB,
  FLEX_RCC,
  FLEX_RCS,
} from 'constant/StyledCommonCss';
import {
  CV_DISTANT,
  CV_GRAY_DARK,
  CV_WHITE,
  TCV_DEFAULT,
  TCV_VERYWARM,
} from 'constant/CssVariables';

const { GlobalUtilities, RV_Float } = window;

export const FileCellContainer = styled.div.attrs({
  className: `${BO_RADIUS_QUARTER} ${BO_DISTANT}`,
})`
  width: 100%;
  height: 2.5rem;
  max-height: 2.5rem;
  padding: 0 0.5rem;
  position: relative;
  ${FLEX_RCB}
`;

export const FilesWrapper = styled.div`
  width: 100%;
  ${FLEX_CCC}
  gap: 0.2rem;
`;

export const FileInfoWrapper = styled.div`
  width: ${({ editable }) => (editable ? '88%' : '100%')};
  height: 90%;
  margin-left: 0.5rem;
  ${FLEX_RCS}

  a:active {
    color: ${TCV_DEFAULT};
  }

  //!Create tip title container.
  a[data-title]:hover::after,
  span[data-title]:hover::after {
    content: attr(data-title);
    position: absolute;
    padding: 0 0.5rem;
    font-size: 0.9rem;
    border-radius: 0.2rem;
    background-color: ${CV_GRAY_DARK};
    color: ${CV_WHITE};
    top: -2.4rem;
    z-index: ${GlobalUtilities.zindex.dialog()};
    left: 50%;
    transform: translate(-50%, 0);
  }

  //! Create tip triangle.
  a[data-title]:hover::before,
  span[data-title]:hover::before {
    content: '';
    position: absolute;
    top: -0.8rem;
    z-index: ${GlobalUtilities.zindex.dialog()};
    left: 50%;
    transform: translate(-50%, 0);
    width: 0;
    height: 0;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-top: 12px solid ${CV_GRAY_DARK};
  }
`;

export const FileLinkWrapper = styled.div.attrs({
  className: `${TC_DEFAULT}`,
})`
  width: 100%;
  height: 100%;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 0.3rem;
  margin-${RV_Float}: 0.3rem;
  border-${RV_Float}: 1px solid ${CV_DISTANT};
  line-height: 2rem;

  a {
    color: ${TCV_VERYWARM};
  }
`;

export const AddNewFile = styled.div`
  ${FLEX_RCC}
  gap: 0.5rem;
  cursor: pointer;
`;

export const EmptyCellView = styled.div`
  color: ${CV_DISTANT};
  width: 100%;
  text-align: start;
  padding-${RV_Float}: 0.7rem;
`;
