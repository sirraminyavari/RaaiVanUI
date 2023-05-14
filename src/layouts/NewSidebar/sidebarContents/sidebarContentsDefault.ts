import { AlbumsSvg, HelpCircleSvg } from '@cliqmind/rv-components';
import { HELP_PATH, TEAMS_PATH } from 'constant/constants';
import { PROFILE_USER } from 'constant/constants';
import SidebarUserAvatar from './sidebarUserAvatar';
import { SidebarContentFunction } from './useSidebarContent';

const SidebarContentDefault: SidebarContentFunction = ({
  history,
  setIsSubMenuToggled,
}) => {
  return {
    mainSidebarPrimaryLinks: [],
    mainSidebarSecondaryLinks: [
      {
        Icon: HelpCircleSvg,
        noIndicator: false,
        onClick: () => {
          history.push(HELP_PATH);
          setIsSubMenuToggled(false);
        },
        path: `${HELP_PATH}`,
      },
      {
        Icon: AlbumsSvg,
        noIndicator: false,
        onClick: () => {
          history.push(`${TEAMS_PATH}`);
          setIsSubMenuToggled(false);
        },
        path: `${TEAMS_PATH}`,
      },
      {
        Icon: SidebarUserAvatar,
        noIndicator: false,
        onClick: () => {
          history.push(`/${PROFILE_USER}`);
          setIsSubMenuToggled(false);
        },
        path: `/${PROFILE_USER}`,
      },
    ],
    subSidebarLinks: [],
  };
};

export default SidebarContentDefault;
