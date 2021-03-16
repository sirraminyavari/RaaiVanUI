import { memo } from 'react';
import { BsArrowBarRight, BsArrowBarLeft } from 'react-icons/bs';

const SidebarToggleIcon = ({ dir: direction, ...rest }) => {
  switch (direction) {
    case 'left':
      return <BsArrowBarLeft {...rest} />;
    default:
      return <BsArrowBarRight {...rest} />;
  }
};

export default memo(SidebarToggleIcon);
