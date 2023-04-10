import { SidebarMain, SidebarSubMenu } from '@cliqmind/rv-components';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import useSidebarContent from './sidebarContents/useSidebarContent';
import { selectApplication } from 'store/slice/applications/selectors';
import { useHistory } from 'react-router-dom';
import { decodeBase64 } from 'helpers/helpers';
import SidebarUserAvatar from './sidebarContents/sidebarUserAvatar';
import { PROFILE_USER } from 'constant/constants';

const PrimarySidebar = () => {
  const history = useHistory();
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
        currentPath={history.location.pathname}
        primaryLinks={mainSidebarPrimaryLinks || []}
        secondaryLinks={mainSidebarSecondaryLinks || []}
      >
        <SidebarUserAvatar
          onClick={() => {
            history.push(PROFILE_USER);
            setIsSubMenuToggled(false);
          }}
        />
      </SidebarMain>
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
