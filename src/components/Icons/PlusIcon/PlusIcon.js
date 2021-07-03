import { BsPlusCircleFill, BsPlusCircle } from 'react-icons/bs';

const PlusIcon = (props) => {
  const { fill, ...rest } = props;
  return !!fill ? <BsPlusCircleFill {...rest} /> : <BsPlusCircle {...rest} />;
};

export default PlusIcon;
