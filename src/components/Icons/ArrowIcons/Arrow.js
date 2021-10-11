import PropTypes from 'prop-types';
import {
  BsArrowUp,
  BsArrowDown,
  BsArrowLeft,
  BsArrowRight,
  //BsArrowUpDown,
  BsArrowLeftRight,
} from 'react-icons/bs';

const ArrowIcon = ({ dir: direction, ...rest }) => {
  switch (direction) {
    case 'down':
      return <BsArrowDown {...rest} />;
    case 'up':
      return <BsArrowUp {...rest} />;
    case 'left':
      return <BsArrowLeft {...rest} />;
    case 'up-down':
      return <BsArrowUp {...rest} />;
    //return <BsArrowUpDown {...rest} />;
    case 'left-right':
      return <BsArrowLeftRight {...rest} />;
    default:
      return <BsArrowRight {...rest} />;
  }
};

ArrowIcon.propTypes = {
  dir: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
};

export default ArrowIcon;
