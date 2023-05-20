import { SidebarMain, SidebarSubMenu } from '@cliqmind/rv-components';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import useSidebarContent from './sidebarContents/useSidebarContent';
import { selectApplication } from 'store/slice/applications/selectors';
import { useHistory } from 'react-router-dom';
import { decodeBase64 } from 'helpers/helpers';
import styles from './sidebarStyles.module.scss';
import {
  CLASSES_PATH,
  CONFIG_GROUPS_PATH,
  CONFIG_USERS_PATH,
  HOME_PATH,
  PROFILE_USER,
  TEAM_SETTINGS_PATH,
} from 'constant/constants';
import { selectSidebar } from 'store/slice/sidebar/selectors';

const PrimarySidebar = () => {
  const history = useHistory();
  const [isSubMenuToggled, setIsSubMenuToggled] = useState(false);
  const urlParams = useParams();
  const { currentApp } = useSelector(selectApplication);
  const { tree } = useSelector(selectSidebar);
  const {
    mainSidebarPrimaryLinks,
    mainSidebarSecondaryLinks,
    subSidebarLinks,
  } = useSidebarContent({
    isSubMenuToggled,
    setIsSubMenuToggled,
    urlParams,
    history,
    selectedApplication: currentApp,
    classesTree: tree,
  });
  const workspaceApplication = useSelector(selectApplication);

  useEffect(() => {
    console.log(CLASSES_PATH, history.location.pathname);

    switch (true) {
      case history.location.pathname.startsWith(CLASSES_PATH):
      case history.location.pathname.startsWith(
        TEAM_SETTINGS_PATH.replace('/:id', '')
      ):
      case history.location.pathname === CONFIG_USERS_PATH:
      case history.location.pathname === CONFIG_GROUPS_PATH:
      case history.location.pathname.startsWith(`/${PROFILE_USER}`):
        setIsSubMenuToggled(true);
        break;
      case history.location.pathname === HOME_PATH:
        setIsSubMenuToggled(false);
        break;

      default:
        setIsSubMenuToggled(false);
        break;
    }

    return () => {};
  }, [history.location, setIsSubMenuToggled]);
  return (
    <div style={{ display: 'flex' }}>
      <SidebarMain
        currentPath={history.location.pathname}
        primaryLinks={mainSidebarPrimaryLinks || []}
        secondaryLinks={mainSidebarSecondaryLinks || []}
      />
      <SidebarSubMenu
        menuSubTitle={decodeBase64(workspaceApplication.currentApp?.Title)}
        menuTitle={decodeBase64(workspaceApplication.currentApp?.Website)}
        open={isSubMenuToggled}
        // CloseTrigger={setIsSubMenuToggled}
        links={subSidebarLinks || []}
        activeLink={`${history.location.pathname}${history.location.search}`}
        className={styles.sidebarSubMenu}
      />
    </div>
  );
};
PrimarySidebar.displayName = 'PrimarySidebar';
export default PrimarySidebar;
