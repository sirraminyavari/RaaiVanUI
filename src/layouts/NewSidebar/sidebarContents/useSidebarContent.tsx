import { Dispatch, SetStateAction, useMemo } from 'react';
import type { History } from 'history';
import {
  CLASSES_PATH,
  NODE_PATH,
  PROFILE_USER,
  TEAMS_PATH,
} from 'constant/constants';
import { useHistory } from 'react-router-dom';
import SidebarContentWorkspaces from './sidebarContentsworkspaces';
import { RVSidebarMain, RVSidebarSubMenu } from '@cliqmind/rv-components';
import SidebarContentClasses from './sidebarContentsClasses';
import { useSelector } from 'react-redux';
import { selectSidebar } from 'store/slice/sidebar/selectors';
import { selectApplication } from 'store/slice/applications/selectors';

interface useSidebarContentPropsType {
  isSubMenuToggled: boolean;
  setIsSubMenuToggled: Dispatch<SetStateAction<boolean>>;
  urlParams: Record<string | number, string | number>;
}
interface useSidebarContentReturnType {
  mainSidebarPrimaryLinks?: RVSidebarMain['primaryLinks'];
  mainSidebarSecondaryLinks?: RVSidebarMain['secondaryLinks'];
  subSidebarIcon?: RVSidebarSubMenu['MenuIcon'];
  subSidebarTitle?: RVSidebarSubMenu['menuTitle'];
  subSidebarSubTitle?: RVSidebarSubMenu['menuSubTitle'];
  subSidebarLinks?: RVSidebarSubMenu['links'];
}

export type SidebarContentFunction<T = Record<string, any>> = ({
  history,
  isSubMenuToggled,
  setIsSubMenuToggled,
}: useSidebarContentPropsType &
  T & {
    history: History;
    selectedApplication: {
      ApplicationID: string;
      WorkspaceID: string;
      Title: string;
      Tagline: string;
      Website: string;
      About: string;
    };
  }) => useSidebarContentReturnType;

const useSidebarContent = ({
  isSubMenuToggled,
  setIsSubMenuToggled,
  urlParams,
}: useSidebarContentPropsType) => {
  const history = useHistory();
  const pathname = history.location.pathname;
  const { tree } = useSelector(selectSidebar);
  const { currentApp } = useSelector(selectApplication);

  const currentRouteSidebarProps = useMemo(() => {
    switch (true) {
      case pathname === TEAMS_PATH:
        return SidebarContentWorkspaces({
          history,
          isSubMenuToggled,
          setIsSubMenuToggled,
          urlParams,
          selectedApplication: currentApp,
        });
      default:
        return SidebarContentClasses({
          history,
          isSubMenuToggled,
          setIsSubMenuToggled,
          urlParams,
          sidebarTree: tree,
          selectedApplication: currentApp,
        });
    }
  }, [
    currentApp,
    history,
    isSubMenuToggled,
    pathname,
    setIsSubMenuToggled,
    tree,
    urlParams,
  ]);

  return currentRouteSidebarProps as useSidebarContentReturnType;
};
useSidebarContent.displayName = 'useSidebarContent';
export default useSidebarContent;
