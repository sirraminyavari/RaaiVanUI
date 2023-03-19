import { SidebarMain, SidebarSubMenu } from '@cliqmind/rv-components';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import useSidebarContent from './sidebarContents/useSidebarContent';
import { selectApplication } from 'store/slice/applications/selectors';
import { decodeBase64 } from 'helpers/helpers';

const PrimarySidebar = () => {
  const [isSubMenuToggled, setIsSubMenuToggled] = useState(false);
  const urlParams = useParams();
  const {
    mainSidebarPrimaryLinks,
    mainSidebarSecondaryLinks,
    subSidebarLinks,
  } = useSidebarContent({ isSubMenuToggled, setIsSubMenuToggled, urlParams });
  const workspaceApplication = useSelector(selectApplication);
  return (
    <div style={{ display: 'flex' }}>
      <SidebarMain
        primaryLinks={mainSidebarPrimaryLinks || []}
        secondaryLinks={mainSidebarSecondaryLinks || []}
      />
      <SidebarSubMenu
        menuSubTitle={decodeBase64(workspaceApplication.currentApp?.Title)}
        menuTitle={decodeBase64(workspaceApplication.currentApp?.Website)}
        open={isSubMenuToggled}
        CloseTrigger={setIsSubMenuToggled}
        links={subSidebarLinks || []}
      />
    </div>
  );
};
PrimarySidebar.displayName = 'PrimarySidebar';
export default PrimarySidebar;
