import styled from 'styled-components';
import { BO_DISTANT } from 'constant/Colors';
import { BO_RADIUS_QUARTER } from 'constant/constants';
import { FLEX_RCB, FLEX_RCS } from 'constant/StyledCommonCss';
import { CV_GRAY_DARK, CV_WHITE, TCV_DEFAULT } from 'constant/CssVariables';

const { GlobalUtilities } = window;

export const FileCellContainer = styled.div.attrs({
  className: `${BO_RADIUS_QUARTER} ${BO_DISTANT}`,
})`
  width: 100%;
  height: 90%;
  padding: 0 0.5rem;
  ${FLEX_RCB}
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
  a[data-title]:hover::after {
    content: attr(data-title);
    position: absolute;
    padding: 0.5rem;
    font-size: 0.9rem;
    border-radius: 0.2rem;
    background-color: ${CV_GRAY_DARK};
    color: ${CV_WHITE};
    top: -2.3rem;
    z-index: ${GlobalUtilities.zindex.dialog()};
    left: 50%;
    transform: translate(-50%, 0);
  }

  //! Create tip triangle.
  a[data-title]:hover::before {
    content: '';
    position: absolute;
    top: -0.3rem;
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

export const FileLinkWrapper = styled.div`
  width: 100%;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 0.2rem;
  padding: 0 0.5rem;
`;
