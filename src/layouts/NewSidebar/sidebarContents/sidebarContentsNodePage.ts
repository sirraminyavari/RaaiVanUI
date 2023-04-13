import { CMLogoSvg } from '@cliqmind/rv-components';
import { SidebarContentFunction } from './useSidebarContent';
import SidebarContentDefault from './sidebarContentsDefault';

const SidebarContentNodePage: SidebarContentFunction = ({
  history,
  isSubMenuToggled,
  setIsSubMenuToggled,
  urlParams,
}) => {
  const defaults = SidebarContentDefault({
    history,
    isSubMenuToggled,
    setIsSubMenuToggled,
    urlParams,
  });
  return {
    mainSidebarPrimaryLinks: [
      ...(defaults?.mainSidebarPrimaryLinks || []),
      {
        Icon: CMLogoSvg,
        title: '',
        onClick: () => {},
        noIndicator: true,
      },
    ],
    mainSidebarSecondaryLinks: [...(defaults?.mainSidebarSecondaryLinks || [])],
    subSidebarLinks: [...(defaults?.subSidebarLinks || [])],
  };
};

export default SidebarContentNodePage;
