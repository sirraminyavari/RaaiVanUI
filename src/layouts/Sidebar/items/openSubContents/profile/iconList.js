import UserIcon from 'components/Icons/UserIcon/User';
import AccountManIcon from 'components/Icons/AccountManIcon/AccountManIcon';
import LockIcon from 'components/Icons/LockIcon/LockIcon';
import BriefcaseIcon from 'components/Icons/BriefcaseIcon/BriefcaseIcon';
import ColorPaletteIcon from 'components/Icons/ColorPaletteIcon/ColorPalette';

import {
  PROFILE_CUSTOMIZATION,
  PROFILE_MISSIONS,
  PROFILE_RESUME,
  PROFILE_SECURITY,
  PROFILE_USER,
} from 'constant/constants';
import { CV_WHITE } from 'constant/CssVariables';

const profileIcons = {
  [PROFILE_USER]: (props) => <UserIcon {...props} />,
  [PROFILE_RESUME]: (props) => <AccountManIcon color={CV_WHITE} {...props} />,
  [PROFILE_SECURITY]: (props) => <LockIcon {...props} />,
  [PROFILE_CUSTOMIZATION]: (props) => <ColorPaletteIcon {...props} />,
  [PROFILE_MISSIONS]: (props) => <BriefcaseIcon fill {...props} />,
};

export default profileIcons;
