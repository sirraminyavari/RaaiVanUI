import Avatar from 'components/Avatar/Avatar';
import Heading from 'components/Heading/Heading';
import { BO_RADIUS_CIRCLE, BO_RADIUS_HALF } from 'constant/constants';
import {
  CV_DISTANT,
  CV_GRAY,
  CV_RED,
  CV_WHITE,
  TCV_DEFAULT,
  TCV_VERY_TRANSPARENT,
} from 'constant/CssVariables';
import {
  FLEX_RCB,
  FLEX_CCB,
  FLEX_CSA,
  FLEX_RCA,
  FLEX_RCE,
  FLEX_RCS,
} from 'constant/StyledCommonCss';
import styled from 'styled-components';

export const FilesContainer = styled.div`
  width: 100%;
`;
FilesContainer.displayName = 'FilesContainer';

export const FileFieldContainer = styled.div.attrs({
  className: BO_RADIUS_HALF,
})`
  ${FLEX_RCB};
  border: 0.5px solid ${CV_DISTANT};
  margin-block: 0.6rem;
  padding-block: 0.5rem;
  padding-inline: 0.8rem;
`;
FileFieldContainer.displayName = 'FileFieldContainer';

export const FileFieldTypeIconWrapper = styled.div`
  ${FLEX_CCB};
  padding-block-start: 0.3rem;
  padding-block-end: 0.1rem;
  padding-inline: 0.5rem;

  & > div:nth-child(2) {
    margin-block-start: 0.5rem;
  }
`;
FileFieldTypeIconWrapper.displayName = 'FileFieldTypeIconWrapper';

export const FileFieldMutedInfoText = styled.div`
  color: ${CV_GRAY};
  ${({ width }) => width && `width: ${width};`}
  ${({ truncate }) =>
    truncate &&
    `
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
`}
`;
FileFieldMutedInfoText.displayName = 'FileFieldMutedInfoText';

export const FileFieldInfoWrapper = styled.div`
  ${({ column }) => (column ? FLEX_CSA : FLEX_RCB)}
  ${({ column }) => column && `gap: 0.5rem;`}
padding-block: 0.3rem;
  padding-inline: 0.5rem;
  width: 100%;
`;
FileFieldInfoWrapper.displayName = 'FileFieldInfoWrapper';

export const FileFieldActionWrapper = styled.div`
  ${({ column }) => (column ? FLEX_RCA : `${FLEX_RCE}`)}
  width:100%;
  margin-inline: auto;
`;
FileFieldActionWrapper.displayName = 'FileFieldActionWrapper';

export const FileFieldAvatarWrapper = styled.div`
  ${({ column }) => (column ? FLEX_RCB : FLEX_RCA)}
  ${({ column }) => column && `margin-block-start: 1rem;`}
`;
FileFieldAvatarWrapper.displayName = 'FileFieldAvatarWrapper';

export const FileFieldTitle = styled(Heading).attrs({ type: 'H4' })`
  font-weight: 500 !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 90%;
`;
FileFieldTitle.displayName = 'FileFieldTitle';

export const FileFieldAvatar = styled(Avatar)`
  width: 1.9rem;
  aspect-ratio: 1/1;
  margin-inline-start: 0.5rem;
  margin-inline-end: 1rem;
  img {
    width: 100%;
    height: 100%;
  }
`;
FileFieldAvatar.displayName = 'FileFieldAvatar';

export const FileFieldRemoveButton = styled.div`
  font-size: 1rem;
  height: 1.8rem;
  ${FLEX_RCS}
  cursor: pointer;
  color: ${CV_DISTANT};

  :hover {
    color: ${CV_RED};
  }
`;
FileFieldRemoveButton.displayName = 'FileFieldRemoveButton';

export const FileFieldProgressBar = styled.div.attrs({
  className: BO_RADIUS_HALF,
})`
  ${FLEX_RCE}
  height:0.8rem;
  width: 100%;
  margin-inline-end: 1rem;
  margin-block-start: 1rem;
  background-color: ${TCV_VERY_TRANSPARENT};
`;
FileFieldProgressBar.displayName = 'FileFieldProgressBar';

export const FileFieldProgressBarThumb = styled.div.attrs({
  className: BO_RADIUS_HALF,
})`
  height: 100%;
  width: ${({ width }) => width || 0}%;
  background-color: ${TCV_DEFAULT};
  transition: width 0.3s ease;
`;
FileFieldProgressBarThumb.displayName = 'FileFieldProgressBarThumb';

export const FileFieldDownloadButton = styled.div.attrs({
  className: `${BO_RADIUS_CIRCLE}`,
})`
  font-size: 1rem;
  padding: 0.1rem 0.3rem;
  border: 1px solid ${CV_WHITE};
  // width: 5rem;
  text-align: center;
  margin-inline: 0.5rem;
  padding-inline: 1rem;

  :hover {
    border-color: ${TCV_DEFAULT};
  }

  a {
    width: 100%;
    display: inline-block;
    color: ${TCV_DEFAULT};
    font-weight: normal;
  }
`;
FileFieldDownloadButton.displayName = 'FileFieldDownloadButton';
