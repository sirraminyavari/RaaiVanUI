import {
  BsChevronCompactUp,
  BsChevronCompactDown,
  BsChevronCompactLeft,
  BsChevronCompactRight,
} from 'react-icons/bs';

import {
  IoIosArrowUp,
  IoIosArrowDown,
  IoIosArrowBack,
  IoIosArrowForward,
} from 'react-icons/io';

const ChevronIcon = ({ dir: direction, small, ...rest }) => {
  switch (direction) {
    case 'down':
      return !!small ? (
        <IoIosArrowDown {...rest} />
      ) : (
        <BsChevronCompactDown {...rest} />
      );
    case 'up':
      return !!small ? (
        <IoIosArrowUp {...rest} />
      ) : (
        <BsChevronCompactUp {...rest} />
      );
    case 'left':
      return !!small ? (
        <IoIosArrowBack {...rest} />
      ) : (
        <BsChevronCompactLeft {...rest} />
      );
    default:
      return !!small ? (
        <IoIosArrowForward {...rest} />
      ) : (
        <BsChevronCompactRight {...rest} />
      );
  }
};

export default ChevronIcon;
