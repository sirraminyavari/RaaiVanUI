/**
 * A function to return details about screen dimension.
 */
import { useMediaQuery } from 'react-responsive';

const DimensionHelper = () => {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });

  const DimensionProps = {
    isTabletOrMobile: isTabletOrMobile,
  };

  return DimensionProps;
};

export default DimensionHelper;
