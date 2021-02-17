import { AiFillHome } from 'react-icons/ai';
import { FiTarget } from 'react-icons/fi';
import { FaUsers, FaInbox, FaPlusCircle, FaSitemap } from 'react-icons/fa';
import { MdNotifications } from 'react-icons/md';
import { BiDirections, BiMessageRoundedDetail } from 'react-icons/bi';
import { BsQuestionCircleFill } from 'react-icons/bs';

const NavbarIcons = {
  home: (props) => <AiFillHome {...props} />,
  teams: (props) => <FaUsers {...props} />,
  dashboard: (props) => <FaInbox {...props} />,
  notifications: (props) => <MdNotifications {...props} />,
  direction: (props) => <BiDirections {...props} />,
  question: (props) => <BsQuestionCircleFill {...props} />,
  messages: (props) => <BiMessageRoundedDetail {...props} />,
  plus: (props) => <FaPlusCircle {...props} />,
  site: (props) => <FaSitemap {...props} />,
  target: (props) => <FiTarget {...props} />,
};

export default NavbarIcons;
