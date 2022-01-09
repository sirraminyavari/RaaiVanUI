import { MdContentCopy } from 'react-icons/md';
import { IoCopyOutline } from 'react-icons/io5';

const CopyIcon = ({ square, ...props }) => {
  if (!!square) {
    return <IoCopyOutline {...props} />;
  }
  return <MdContentCopy {...props} />;
};

export default CopyIcon;
