import { AiFillHome } from 'react-icons/ai';
import { FaUsers, FaInbox } from 'react-icons/fa';
import { MdNotifications } from 'react-icons/md';

const NavbarIcons = {
  home: (props) => <AiFillHome {...props} />,
  teams: (props) => <FaUsers {...props} />,
  dashboard: (props) => <FaInbox {...props} />,
  notifications: (props) => <MdNotifications {...props} />,
};

export default NavbarIcons;
