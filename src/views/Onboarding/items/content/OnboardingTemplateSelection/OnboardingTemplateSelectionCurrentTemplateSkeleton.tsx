import React from 'react';
import styled from 'styled-components';
import Shimmer from 'components/Shimmer/Shimmer';
import CaretIcon from 'components/Icons/CaretIcons/Caret';
import useWindowContext from 'hooks/useWindowContext';
import { CV_DISTANT } from 'constant/CssVariables';
import Avatar from 'components/Avatar/Avatar';

const emptyImage = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

const OnboardingTemplateSelectionCurrentTemplateSkeleton = () => {
  return (
    <>
      <Shimmer>
        <OnboardingTemplateSelectionCurrentTemplateAvatar>
          <Avatar
            //@ts-expect-error
            className="shimmerEffect Avatar"
            userImage={emptyImage}
            radius={65}
          />
        </OnboardingTemplateSelectionCurrentTemplateAvatar>
        <OnboardingTemplateSelectionCurrentTemplateTitle>
          <div className="shimmerEffect">
            <TextStringSkeleton size="small" />
          </div>
        </OnboardingTemplateSelectionCurrentTemplateTitle>
        <OnboardingTemplateSelectionCurrentTemplate>
          <div className="shimmerEffect">
            <TextStringSkeleton size="large" />
            <TextStringSkeleton size="large" />
            <TextStringSkeleton size="medium" />
          </div>
        </OnboardingTemplateSelectionCurrentTemplate>
      </Shimmer>
    </>
  );
};

export default OnboardingTemplateSelectionCurrentTemplateSkeleton;

const OnboardingTemplateSelectionCurrentTemplateAvatar = styled.div`
  width: 100%;
  margin-block-end: 1rem;
`;
OnboardingTemplateSelectionCurrentTemplateAvatar.displayName =
  'OnboardingTemplateSelectionCurrentTemplateAvatar';

const OnboardingTemplateSelectionCurrentTemplateTitle = styled.div`
  width: 100%;
  margin-block: 0.4rem;
`;
OnboardingTemplateSelectionCurrentTemplateTitle.displayName =
  'OnboardingTemplateSelectionCurrentTemplateTitle';

const OnboardingTemplateSelectionCurrentTemplate = styled.div`
  width: 100%;
  padding: 0.7rem;
  margin-inline: 0.7rem;
  margin-block: 0.4rem;
`;
OnboardingTemplateSelectionCurrentTemplate.displayName =
  'OnboardingTemplateSelectionCurrentTemplate';

const TextStringSkeleton = styled.div<{
  size?: 'small' | 'large' | 'medium';
}>`
  height: 0.8rem;
  display: block;
  border-radius: 0.4rem;
  margin-block: 0.4rem;
  min-width: 6.5rem;
  width: ${({ size }) => {
    switch (size) {
      case 'small':
        return '0';
      case 'large':
        return '75';
      default:
        return '60';
    }
  }}%;
`;

TextStringSkeleton.displayName = 'TextStringSkeleton';
