import { IoRemove, IoRemoveOutline } from 'react-icons/io5';

const MinusIcon = ({ circleOutline = false, ...props }) => {
  return !circleOutline ? (
    <IoRemove {...props} />
  ) : (
    <IoRemoveOutline {...props} />
  );
};

export default MinusIcon;
