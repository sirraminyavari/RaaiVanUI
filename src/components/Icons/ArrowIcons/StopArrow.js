import PropTypes from 'prop-types';
import {
  BiArrowToTop,
  BiArrowToBottom,
  BiArrowToLeft,
  BiArrowToRight,
} from 'react-icons/bi';

const StopArrowIcon = ({ dir: direction, ...rest }) => {
  switch (direction) {
    case 'down':
      return <BiArrowToBottom {...rest} />;
    case 'up':
      return <BiArrowToTop {...rest} />;
    case 'left':
      return <BiArrowToLeft {...rest} />;
    default:
      return <BiArrowToRight {...rest} />;
  }
};

StopArrowIcon.propTypes = {
  dir: PropTypes.string,
  size: PropTypes.number,
  color: PropTypes.string,
};

export default StopArrowIcon;
