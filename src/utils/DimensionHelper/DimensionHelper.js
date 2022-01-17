/**
 * A function to return details about screen dimension.
 */
import {
  MOBILE_BOUNDRY,
  MEDIUM_BOUNDRY,
  WIDE_BOUNDRY,
} from 'constant/constants';
import { useMediaQuery } from 'react-responsive';

const DimensionHelper = () => {
  const smallBoundary = useMediaQuery({
    query: `(max-width: ${MOBILE_BOUNDRY})`,
  });
  const wideBoundary = useMediaQuery({
    query: `(max-width: ${WIDE_BOUNDRY})`,
  });
  const mediumBoundary = useMediaQuery({
    query: `(max-width: ${MEDIUM_BOUNDRY})`,
  });
  const DimensionProps = {
    isTabletOrMobile: mediumBoundary,
    isTabletOrDesktop: !smallBoundary,
    isMobile: smallBoundary,
    isTablet: !smallBoundary && mediumBoundary,
    isDesktop: !mediumBoundary && wideBoundary,
    isWideDesktop: !wideBoundary,
  };

  return DimensionProps;
};

export default DimensionHelper;
