import { AlbumsSvg } from '@cliqmind/rv-components';
import { TEAMS_PATH } from 'constant/constants';
import { SidebarContentFunction } from './useSidebarContent';

const SidebarContentDefault: SidebarContentFunction = ({
  history,
  setIsSubMenuToggled,
}) => {
  return {
    mainSidebarPrimaryLinks: [],
    mainSidebarSecondaryLinks: [
      {
        Icon: AlbumsSvg,
        noIndicator: false,
        onClick: () => {
          history.push(TEAMS_PATH);
          setIsSubMenuToggled(false);
        },
        path: '/workspaces',
      },
    ],
    subSidebarLinks: [],
  };
};

export default SidebarContentDefault;
