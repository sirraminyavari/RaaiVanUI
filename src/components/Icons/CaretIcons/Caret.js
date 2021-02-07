import {
  BsCaretDownFill,
  BsFillCaretUpFill,
  BsFillCaretLeftFill,
  BsFillCaretRightFill,
} from 'react-icons/bs';

const CaretIcon = ({ dir: direction, ...rest }) => {
  switch (direction) {
    case 'down':
      return <BsCaretDownFill {...rest} />;
    case 'up':
      return <BsFillCaretUpFill {...rest} />;
    case 'left':
      return <BsFillCaretLeftFill {...rest} />;
    default:
      return <BsFillCaretRightFill {...rest} />;
  }
};

export default CaretIcon;
