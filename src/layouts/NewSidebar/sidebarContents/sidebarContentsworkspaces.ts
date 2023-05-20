import { CMLogoSvg } from '@cliqmind/rv-components';
import { SidebarContentFunction } from './useSidebarContent';
import SidebarContentDefault from './sidebarContentsDefault';

const SidebarContentWorkspaces: SidebarContentFunction = ({
  history,
  isSubMenuToggled,
  setIsSubMenuToggled,
  urlParams,
  selectedApplication,
  classesTree,
}) => {
  const defaults = SidebarContentDefault({
    history,
    isSubMenuToggled,
    setIsSubMenuToggled,
    urlParams,
    selectedApplication,
    classesTree,
  });
  return {
    mainSidebarPrimaryLinks: [
      ...(defaults?.mainSidebarPrimaryLinks || []),
      {
        Icon: CMLogoSvg,
        title: '',
        onClick: () => {},
        noIndicator: true,
        path: '/logo',
      },
    ],
    mainSidebarSecondaryLinks: [...(defaults?.mainSidebarSecondaryLinks || [])],
    subSidebarLinks: [...(defaults?.subSidebarLinks || [])],
  };
};

export default SidebarContentWorkspaces;
