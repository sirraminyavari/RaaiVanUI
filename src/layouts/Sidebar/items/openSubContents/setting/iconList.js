import TeamIcon from 'components/Icons/GroupIcon/Group';
import UsersIcon from 'components/Icons/UsersIcon/Users';
import ClassesIcon from 'components/Icons/TuneIcon/Tune';
import AlertIcon from 'components/Icons/NotificationsIcon/NotificationsIcon';
import InvoiceIcon from 'components/Icons/InvoiceIcon/InvoiceIcon';
import PlansIcon from 'components/Icons/PlansIcon/PlansIcon';
import {
  SETT_CLASSES_CONTENT,
  SETT_NOTIFS_CONTENT,
  SETT_TEAM_CONTENT,
  SETT_USERS_CONTENT,
  SETT_WORKSPACE_INVOICE_CONTENT,
  SETT_WORKSPACE_PLANS_CONTENT,
} from 'constant/constants';

const settingIcons = {
  // TODO: add icons for other settings(for panels)
  [SETT_TEAM_CONTENT]: (props) => <TeamIcon {...props} />,
  [SETT_USERS_CONTENT]: (props) => <UsersIcon {...props} />,
  [SETT_CLASSES_CONTENT]: (props) => <ClassesIcon {...props} />,
  [SETT_NOTIFS_CONTENT]: (props) => <AlertIcon {...props} />,
  [SETT_WORKSPACE_INVOICE_CONTENT]: (props) => <InvoiceIcon {...props} />,
  [SETT_WORKSPACE_PLANS_CONTENT]: (props) => <PlansIcon {...props} />,
};

export default settingIcons;
