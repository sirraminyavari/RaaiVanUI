import PropTypes from 'prop-types';
import {
  BsArrowUp,
  BsArrowDown,
  BsArrowLeft,
  BsArrowRight,
  BsArrowDownUp,
  BsArrowLeftRight,
} from 'react-icons/bs';
import {
  IoArrowDownCircleOutline,
  IoArrowUpCircleOutline,
  IoArrowBackCircleOutline,
  IoArrowForwardCircleOutline,
} from 'react-icons/io5';

const ArrowIcon = ({ dir: direction, circle, ...rest }) => {
  switch (direction) {
    case 'down':
      if (!!circle) {
        return <IoArrowDownCircleOutline {...rest} />;
      }
      return <BsArrowDown {...rest} />;
    case 'up':
      if (!!circle) {
        return <IoArrowUpCircleOutline {...rest} />;
      }
      return <BsArrowUp {...rest} />;
    case 'left':
      if (!!circle) {
        return <IoArrowBackCircleOutline {...rest} />;
      }
      return <BsArrowLeft {...rest} />;
    case 'up-down':
      return <BsArrowDownUp {...rest} />;
    case 'left-right':
      return <BsArrowLeftRight {...rest} />;
    default:
      if (!!circle) {
        return <IoArrowForwardCircleOutline {...rest} />;
      }
      return <BsArrowRight {...rest} />;
  }
};

ArrowIcon.propTypes = {
  dir: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
};

export default ArrowIcon;
