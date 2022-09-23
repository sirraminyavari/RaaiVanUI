import { BiCheck } from 'react-icons/bi';
import { GoCheck } from 'react-icons/go';

const CheckIcon = ({ bold = false, ...props }) => {
  const Check = bold ? GoCheck : BiCheck;
  return <Check {...props} />;
};

export default CheckIcon;
