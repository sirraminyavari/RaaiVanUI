import TeamIcon from 'components/Icons/GroupIcon/Group';
import UsersIcon from 'components/Icons/UsersIcon/Users';
import ClassesIcon from 'components/Icons/TuneIcon/Tune';
import AlertIcon from 'components/Icons/NotificationsIcon/NotificationsIcon';
import {
  SETT_CLASSES_CONTENT,
  SETT_NOTIFS_CONTENT,
  SETT_TEAM_CONTENT,
  SETT_USERS_CONTENT,
} from 'constant/constants';

const settingIcons = {
  // TODO: add icons for other settings(for panels)
  [SETT_TEAM_CONTENT]: (props) => <TeamIcon {...props} />,
  [SETT_USERS_CONTENT]: (props) => <UsersIcon {...props} />,
  [SETT_CLASSES_CONTENT]: (props) => <ClassesIcon {...props} />,
  [SETT_NOTIFS_CONTENT]: (props) => <AlertIcon {...props} />,
};

export default settingIcons;
