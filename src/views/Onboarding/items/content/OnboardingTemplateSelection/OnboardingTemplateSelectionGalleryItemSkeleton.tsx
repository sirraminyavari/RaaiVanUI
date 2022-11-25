import React from 'react';
import styled from 'styled-components';
import Shimmer from 'components/Shimmer/Shimmer';
import CaretIcon from 'components/Icons/CaretIcons/Caret';
import useWindowContext from 'hooks/useWindowContext';
import { CV_DISTANT } from 'constant/CssVariables';

const OnboardingTemplateSelectionGalleryItemSkeleton = () => {
  const { RV_RevFloat } = useWindowContext();
  return (
    <>
      <Shimmer>
        {new Array(4).fill(null).map((_, key) => (
          <GalleryItem key={key}>
            <CaretIcon dir={RV_RevFloat} />
            <div className="shimmerEffect">
              <TextStringSkeleton
                size={['medium', 'small', 'medium', 'large'][key]}
              />
            </div>
          </GalleryItem>
        ))}
      </Shimmer>
    </>
  );
};

export default OnboardingTemplateSelectionGalleryItemSkeleton;
const GalleryItem = styled.div`
  width: 100%;
  padding: 0.7rem;
  margin-inline: 0.7rem;
  margin-block: 0.4rem;
  display: flex;
  align-items: center;
  color: ${CV_DISTANT};
  column-gap: 1rem;
`;
GalleryItem.displayName = 'GalleryItem';
const GalleryItemCaretIcon = styled(CaretIcon)``;
GalleryItemCaretIcon.displayName = 'GalleryItemCaretIcon';

const TextStringSkeleton = styled.div<{
  size?: 'small' | 'large' | 'medium' | string;
}>`
  height: 0.8rem;
  display: block;
  border-radius: 0.4rem;
  margin-block: 0.4rem;
  width: ${({ size }) => {
    switch (size) {
      case 'small':
        return '4.5';
      case 'large':
        return '7.5';
      default:
        return '6';
    }
  }}rem;
`;

TextStringSkeleton.displayName = 'TextStringSkeleton';
