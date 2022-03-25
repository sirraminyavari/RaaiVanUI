import React, { useMemo, useRef } from 'react';
import * as Styles from './Carousel.styles';
import ChevronIcon from 'components/Icons/ChevronIcons/Chevron';

/**
 * @component - Carousel Component
 * @param {React.BaseHTMLAttributes} props
 * @param {number} props.scrollSpeed - Width of the content to be scrolled when navigation buttons clicked (in Pixels)
 * @param {boolean} props.NoNavigationButton - whether to show or hide navigation buttons
 * @param {React.Node} props.children - Carousel's Items to show
 * @returns {JSX.Element}
 */
const Carousel = ({
  children,
  scrollSpeed = 300,
  NoNavigationButton = false,
  ...restProps
}) => {
  const carouselRef = useRef(null);

  const carouselNavigationHandler = useMemo(
    () =>
      ({ direction }) => {
        if (carouselRef.current === null) return;
        if (direction === 'left') carouselRef.current.scrollLeft -= scrollSpeed;
        else if (direction === 'right')
          carouselRef.current.scrollLeft += scrollSpeed;
      },
    [carouselRef, scrollSpeed]
  );

  return (
    <Styles.CarouselContainer {...restProps}>
      {!NoNavigationButton && (
        <>
          <Styles.CarouselNavigationButton
            dir="left"
            onClick={() => carouselNavigationHandler({ direction: 'left' })}
          >
            <ChevronIcon small dir="left" />
          </Styles.CarouselNavigationButton>
          <Styles.CarouselNavigationButton
            dir="right"
            onClick={() => carouselNavigationHandler({ direction: 'right' })}
          >
            <ChevronIcon small dir="right" />
          </Styles.CarouselNavigationButton>
        </>
      )}
      <Styles.CarouselInnerContainer ref={carouselRef}>
        {children}
      </Styles.CarouselInnerContainer>
    </Styles.CarouselContainer>
  );
};

Carousel.displayName = 'Carousel';

export default Carousel;
