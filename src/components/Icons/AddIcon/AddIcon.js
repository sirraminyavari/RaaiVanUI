import { IoAdd, IoAddCircleOutline } from 'react-icons/io5';

const AddIcon = ({ circleOutline = false, ...props }) => {
  return !circleOutline ? (
    <IoAdd {...props} />
  ) : (
    <IoAddCircleOutline {...props} />
  );
};

export default AddIcon;
