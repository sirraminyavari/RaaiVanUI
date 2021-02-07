import {
  BsChevronCompactUp,
  BsChevronCompactDown,
  BsChevronCompactLeft,
  BsChevronCompactRight,
} from 'react-icons/bs';

const ChevronIcon = ({ dir: direction, ...rest }) => {
  switch (direction) {
    case 'down':
      return <BsChevronCompactDown {...rest} />;
    case 'up':
      return <BsChevronCompactUp {...rest} />;
    case 'left':
      return <BsChevronCompactLeft {...rest} />;
    default:
      return <BsChevronCompactRight {...rest} />;
  }
};

export default ChevronIcon;
