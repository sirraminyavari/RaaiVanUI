import { BsPlusCircleFill, BsPlusCircle } from 'react-icons/bs';

const PlusIcon = ({ fill, ...props } = {}) => {
  return !!fill ? <BsPlusCircleFill {...props} /> : <BsPlusCircle {...props} />;
};

export default PlusIcon;
