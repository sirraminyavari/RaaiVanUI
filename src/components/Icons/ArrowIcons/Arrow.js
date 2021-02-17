import {
  BsArrowUp,
  BsArrowDown,
  BsArrowLeft,
  BsArrowRight,
} from 'react-icons/bs';

const ArrowIcon = ({ dir: direction, ...rest }) => {
  switch (direction) {
    case 'down':
      return <BsArrowDown {...rest} />;
    case 'up':
      return <BsArrowUp {...rest} />;
    case 'left':
      return <BsArrowLeft {...rest} />;
    default:
      return <BsArrowRight {...rest} />;
  }
};

export default ArrowIcon;
