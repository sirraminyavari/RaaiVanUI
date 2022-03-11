import * as Styles from './OnboardingTemplateSelection.styles';
import PanelButton from 'components/Buttons/PanelButton';
import ChevronIcon from 'components/Icons/ChevronIcons/Chevron';
import { useMemo, useRef } from 'react';

// TODO extract carousel as a reusable component
const OnboardingTemplateSelectionCarousel = () => {
  const carouselRef = useRef(null);

  const carouselNavigationHandler = useMemo(
    () =>
      ({ direction }) => {
        if (carouselRef.current === null) return;
        if (direction === 'left') carouselRef.current.scrollLeft -= 300;
        else if (direction === 'right') carouselRef.current.scrollLeft += 300;
      },
    [carouselRef]
  );

  return (
    <Styles.OnboardingTemplateSelectionCarouselContainer>
      <Styles.OnboardingTemplateSelectionCarouselNavigationButton
        dir="left"
        onClick={() => carouselNavigationHandler({ direction: 'left' })}
      >
        <ChevronIcon small dir="left" />
      </Styles.OnboardingTemplateSelectionCarouselNavigationButton>
      <Styles.OnboardingTemplateSelectionCarouselNavigationButton
        dir="right"
        onClick={() => carouselNavigationHandler({ direction: 'right' })}
      >
        <ChevronIcon small dir="right" />
      </Styles.OnboardingTemplateSelectionCarouselNavigationButton>
      <Styles.OnboardingTemplateSelectionCarouselInnerContainer
        ref={carouselRef}
      >
        {new Array(12).fill('').map((_, idx) => {
          return (
            <PanelButton secondary>
              <img src="/images/preview.png" width="70" />
              بازدید از نمایشگاه {idx}
            </PanelButton>
          );
        })}
      </Styles.OnboardingTemplateSelectionCarouselInnerContainer>
    </Styles.OnboardingTemplateSelectionCarouselContainer>
  );
};

OnboardingTemplateSelectionCarousel.displayName =
  'OnboardingTemplateSelectionCarousel';

export default OnboardingTemplateSelectionCarousel;
