import PropTypes from 'prop-types';
import {
  HiChevronDoubleUp,
  HiChevronDoubleDown,
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
} from 'react-icons/hi';

const DoubleArrowIcon = ({ dir: direction, ...rest }) => {
  switch (direction) {
    case 'down':
      return <HiChevronDoubleDown {...rest} />;
    case 'up':
      return <HiChevronDoubleUp {...rest} />;
    case 'left':
      return <HiChevronDoubleLeft {...rest} />;
    default:
      return <HiChevronDoubleRight {...rest} />;
  }
};

DoubleArrowIcon.propTypes = {
  dir: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
};

export default DoubleArrowIcon;
