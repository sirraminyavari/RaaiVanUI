import { FiMoreHorizontal, FiMoreVertical } from 'react-icons/fi';

const ShowMoreIcon = ({ dir: direction, ...rest }) => {
  switch (direction) {
    case 'vertical':
      return <FiMoreVertical {...rest} />;
    default:
      return <FiMoreHorizontal {...rest} />;
  }
};

export default ShowMoreIcon;
