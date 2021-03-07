import { RiLogoutCircleLine, RiLogoutCircleRLine } from 'react-icons/ri';

const LogoutIcon = ({ dir: direction, ...rest }) => {
  switch (direction) {
    case 'left':
      return <RiLogoutCircleLine {...rest} />;
    default:
      return <RiLogoutCircleRLine {...rest} />;
  }
};

export default LogoutIcon;
