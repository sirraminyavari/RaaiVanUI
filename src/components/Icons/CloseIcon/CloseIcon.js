import { FaTimes } from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';

const CloseIcon = ({ outline = false, ...props }) => {
  return outline ? <IoCloseOutline {...props} /> : <FaTimes {...props} />;
};

export default CloseIcon;
