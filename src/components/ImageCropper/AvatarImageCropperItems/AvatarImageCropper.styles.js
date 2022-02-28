import Button from 'components/Buttons/Button';
import { BO_RADIUS_CIRCLE, BO_RADIUS_HALF } from 'constant/constants';
import {
  CV_DISTANT,
  CV_RED,
  CV_WHITE,
  TCV_DEFAULT,
} from 'constant/CssVariables';
import styled from 'styled-components';

export const ImageCropperTriggerAvatar = styled.button`
  aspect-ratio: 1;
  width: 7rem;
  border-radius: 100%;
  background-color: #eef1f5;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  margin: 1rem;
  color: ${TCV_DEFAULT};

  & > * {
    transition: transform 0.3s;
  }

  &:hover {
    & > * {
      transform: rotate(-5deg);
    }
  }
`;
ImageCropperTriggerAvatar.displayName = 'ImageCropperTriggerAvatar';

export const ImageCropperSelectionTitle = styled.p`
  font-size: 1rem;
  margin-block: 0.5rem;
  font-weight: bold;
`;
ImageCropperSelectionTitle.displayName = 'ImageCropperSelectionTitle';

export const ImageCropperSelectionDescription = styled.p`
  font-size: 1rem;
  margin-block-end: 0.5rem;
  color: ${CV_DISTANT};
`;
ImageCropperSelectionDescription.displayName =
  'ImageCropperSelectionDescription';

export const ImageCropperSelectionContainer = styled.div.attrs({
  className: BO_RADIUS_HALF,
})`
  width: 100%;
  min-height: 40vh;
  ${({ noBorders }) =>
    !noBorders &&
    `
    border: 1px solid ${CV_DISTANT};
    `}
  position:relative;
  margin-block: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;
ImageCropperSelectionContainer.displayName = 'ImageCropperSelectionContainer';

export const ImageCropperSelectionDeleteButton = styled.button.attrs({
  className: BO_RADIUS_CIRCLE,
})`
  position: absolute;
  inset-block-start: 1.7rem;
  inset-inline-end: 0.7rem;
  aspect-ratio: 1;
  width: 2.2rem;
  height: 2.2rem;
  background-color: ${CV_WHITE};
  font-size: 1rem;
  color: ${CV_DISTANT};

  &:hover {
    color: ${CV_RED};
  }
`;
ImageCropperSelectionDeleteButton.displayName =
  'ImageCropperSelectionDeleteButton';

export const ImageCropperSelectionUploadButton = styled(Button).attrs({
  type: 'primary-o',
})`
  padding-inline: 1rem;
  padding-block: 0.8rem;
  svg {
    font-size: 1.1rem;
    margin-inline-end: 0.5rem;
  }
`;
ImageCropperSelectionUploadButton.displayName =
  'ImageCropperSelectionUploadButton';

export const ImageCropperAvatarImage = styled.img`
  aspect-ratio: 1;
  width: 7rem;
  cursor: pointer;
  transition: transform 0.3s;
  margin: 0.5rem;
`;
ImageCropperAvatarImage.displayName = 'ImageCropperAvatarImage';

export const ImageCropperAvatarImageButton = styled.button`
  position: relative;
  padding-block: 0.5rem;
  padding-inline: 0.3rem;
  transition: opacity 0.3s;
  flex-grow: 0;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    right: 50%;
    width: 0%;
    height: 0.2rem;
    background-color: ${TCV_DEFAULT};
    transition: width 0.3s, right 0.3s;
  }
  ${({ active }) =>
    !active
      ? `
  opacity:0.5;
  `
      : `
  
    ${ImageCropperAvatarImage} {
      transform: scale(1.1);
    }
    &::before {
      right: 33%;
      width: 33%;
    }
  `}

  &:hover {
    opacity: 1;
    ${ImageCropperAvatarImage} {
      transform: scale(1.1);
    }
  }
  &:focus {
  }
`;
ImageCropperAvatarImageButton.displayName = 'ImageCropperAvatarImageButton';

export const ImageCropperAvatarContainer = styled.div`
  width: 100%;
  margin-block: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  ${({ active }) =>
    !active &&
    `
  ${ImageCropperAvatarImageButton} {
    opacity:1 ;
    }
  `}
`;
ImageCropperAvatarContainer.displayName = 'ImageCropperAvatarContainer';

export const ImageCropperActionsContainer = styled.div`
  width: 100%;
  margin-block: 1.5rem 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  & > div {
    padding-inline: 4rem;
  }
`;
ImageCropperActionsContainer.displayName = 'ImageCropperActionsContainer';
