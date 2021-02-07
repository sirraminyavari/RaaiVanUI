import { CgMoreVertical, CgMore } from 'react-icons/cg';

const ShowMoreIcon = ({ dir: direction, ...rest }) => {
  switch (direction) {
    case 'vertical':
      return <CgMoreVertical {...rest} />;
    default:
      return <CgMore {...rest} />;
  }
};

export default ShowMoreIcon;
