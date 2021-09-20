import { BO_DISTANT } from 'constant/Colors';
import { BO_RADIUS_CIRCLE, BO_RADIUS_QUARTER } from 'constant/constants';
import {
  CV_GRAY,
  CV_WHITE,
  TCV_DEFAULT,
  TCV_VERYWARM,
  TCV_VERY_TRANSPARENT,
} from 'constant/CssVariables';
import {
  FLEX_RCA,
  FLEX_RCB,
  FLEX_RCC,
  FLEX_RCS,
} from 'constant/StyledCommonCss';
import styled from 'styled-components';

export const FilesContainer = styled.div`
  width: 100%;
`;

export const FileShowContainer = styled.div.attrs({
  className: `${BO_DISTANT} ${BO_RADIUS_QUARTER}`,
})`
  width: 100%;
  height: 2.5rem;
  margin-bottom: 0.5rem;
  padding: 0 0.6rem;
  user-select: none;
  ${FLEX_RCB}

  .form-file-show-avatar {
    width: 2rem;
    height: 2rem;
    min-width: 2rem;
    min-height: 2rem;
    border: none;
  }
`;

export const FileTitleWrapper = styled.div`
  ${FLEX_RCS}
  width: 50%;
`;

export const FileActionWrapper = styled.div`
  ${FLEX_RCA}
  width: 50%;
`;

export const FileSize = styled.div`
  color: ${CV_GRAY};
  font-size: 1rem;
`;

export const FileLinkWrapper = styled.div.attrs({
  className: `${BO_RADIUS_CIRCLE}`,
})`
  font-size: 1rem;
  padding: 0.1rem 0.3rem;
  border: 1px solid ${CV_WHITE};
  width: 5rem;
  text-align: center;

  :hover {
    border-color: ${TCV_VERYWARM};
  }

  a {
    width: 100%;
    display: inline-block;
    color: ${TCV_VERYWARM};
  }
`;

export const MoreIconWrapper = styled.div.attrs({
  className: `${BO_RADIUS_CIRCLE}`,
})`
  ${FLEX_RCC}
  padding: 0.2rem;
  cursor: pointer;

  :hover {
    background-color: ${TCV_VERY_TRANSPARENT};

    & svg {
      color: ${TCV_DEFAULT} !important;
    }
  }
`;

export const FileShowTitle = styled.div`
  width: 100%;
  margin: 0 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
