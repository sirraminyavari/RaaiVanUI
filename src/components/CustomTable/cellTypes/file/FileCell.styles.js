import styled from 'styled-components';
import { BO_DISTANT, TC_DEFAULT } from 'constant/Colors';
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
  CV_GRAY_DARK,
  CV_WHITE,
  TCV_DEFAULT,
  TCV_VERYWARM,
} from 'constant/CssVariables';
import Heading from 'components/Heading/Heading';

const { GlobalUtilities, RV_Float } = window;

export const FileItemContainer = styled.div.attrs({
  className: `${BO_RADIUS_QUARTER} ${BO_DISTANT}`,
})`
  width: 100%;
  height: 2.5rem;
  max-height: 2.5rem;
  padding: 0 0.5rem;
  position: relative;
  ${FLEX_RCB}
`;

export const FileCellContainer = styled.div`
  width: 100%;
  ${FLEX_CSA}
  gap: 0.5rem;
`;

export const FilesWrapper = styled.div`
  width: 100%;
  ${FLEX_REB}
  gap: 0.5rem;

  .table-file-cell-save-button {
    background-color: inherit;
    padding: 0.3rem;
    height: 1.7rem;
    width: 7rem;
    border-radius: 1rem;
  }
`;

export const FileInfoWrapper = styled.div`
  width: ${({ editable }) => (editable ? '88%' : '100%')};
  height: 90%;
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

export const AddNewFileWrapper = styled.div`
  width: 100%;
`;

export const EmptyCellView = styled.div`
  color: ${CV_DISTANT};
  width: 100%;
  height: 2rem;
  text-align: start;
  padding-${RV_Float}: 0.7rem;
  margin-top: 0.5rem;
`;

export const FileListWrapper = styled.div`
  width: ${({ isEditMode }) => (isEditMode ? '70%' : '100%')};
  max-width: ${({ isEditMode }) => (isEditMode ? '70%' : '100%')};
  min-width: ${({ isEditMode }) => (isEditMode ? '70%' : '100%')};
  ${FLEX_CCC}
  gap: 0.2rem;
`;

export const TrashIconWrapper = styled.div.attrs({
  className: `${BO_RADIUS_CIRCLE}`,
})`
  cursor: pointer;
  padding: 0.3rem;
  ${FLEX_CCC}
`;

export const SaveButtonHeading = styled(Heading)`
  color: ${TCV_DEFAULT};
`;
