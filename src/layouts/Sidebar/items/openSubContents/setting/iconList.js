import TeamIcon from '../../../../../components/Icons/GroupIcon/Group';
import UsersIcon from '../../../../../components/Icons/UsersIcon/Users';
import ClassesIcon from '../../../../../components/Icons/TuneIcon/Tune';
import AlertIcon from '../../../../../components/Icons/NotificationsIcon/NotificationsIcon';

const settingIcons = {
  'setting-team': (props) => <TeamIcon {...props} />,
  'setting-users': (props) => <UsersIcon {...props} />,
  'setting-classes': (props) => <ClassesIcon {...props} />,
  'setting-notifs': (props) => <AlertIcon {...props} />,
};

export default settingIcons;
