import { Dispatch, SetStateAction, useMemo } from 'react';
import type { History } from 'history';
import {
  CLASSES_PATH,
  CONFIG_GROUPS_PATH,
  CONFIG_USERS_PATH,
  HOME_PATH,
  NODE_PATH,
  PROFILE_USER,
  TEMPLATES_SETTING_PATH,
  TEAMS_PATH,
  TEAM_SETTINGS_PATH,
} from 'constant/constants';
import { useHistory } from 'react-router-dom';
import SidebarContentWorkspaces from './sidebarContentsworkspaces';
import { RVSidebarMain, RVSidebarSubMenu } from '@cliqmind/rv-components';
import SidebarContentClasses from './sidebarContentsClasses';
import { useSelector } from 'react-redux';
import { selectSidebar } from 'store/slice/sidebar/selectors';
import { selectApplication } from 'store/slice/applications/selectors';
import SidebarContentTeamSettings from './sidebarContentsTeamSettings';
import SidebarContentsEmptyAction from './sidebarContentsEmptyAction';
import SidebarContentProfile from './sidebarContentsProfile';

interface useSidebarContentPropsType {
  isSubMenuToggled: boolean;
  setIsSubMenuToggled: Dispatch<SetStateAction<boolean>>;
  urlParams: Record<string | number, string | number>;
  history: History<unknown>;
  classesTree: any[];
  selectedApplication: {
    ApplicationID: string;
    WorkspaceID: string;
    Title: string;
    Tagline: string;
    Website: string;
    About: string;
  };
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
}: useSidebarContentPropsType & T) => useSidebarContentReturnType;

const useSidebarContent = ({
  isSubMenuToggled,
  setIsSubMenuToggled,
  urlParams,
  history,
  selectedApplication,
  classesTree,
}: useSidebarContentPropsType) => {
  const pathname = history.location.pathname;

  const currentRouteSidebarProps = useMemo(() => {
    switch (true) {
      case pathname === TEAMS_PATH:
        return SidebarContentWorkspaces({
          history,
          isSubMenuToggled,
          setIsSubMenuToggled,
          urlParams,
          selectedApplication,
          classesTree,
        });
      case pathname.startsWith(`/${PROFILE_USER}`):
        return SidebarContentProfile({
          history,
          isSubMenuToggled,
          setIsSubMenuToggled,
          urlParams,
          selectedApplication,
          classesTree,
        });

      case pathname === CONFIG_USERS_PATH:
      case pathname === CONFIG_GROUPS_PATH:
      case pathname.startsWith(TEAM_SETTINGS_PATH.replace('/:id', '')):
        return SidebarContentTeamSettings({
          history,
          isSubMenuToggled,
          setIsSubMenuToggled,
          urlParams,
          selectedApplication,
          classesTree,
        });
      case pathname.startsWith(CLASSES_PATH):
        return SidebarContentClasses({
          history,
          isSubMenuToggled,
          setIsSubMenuToggled,
          urlParams,
          selectedApplication,
          classesTree,
        });
      case pathname === HOME_PATH:
      case pathname === TEMPLATES_SETTING_PATH:
      default:
        return SidebarContentsEmptyAction({
          history,
          isSubMenuToggled,
          setIsSubMenuToggled,
          urlParams,
          selectedApplication,
          classesTree,
        });
    }
  }, [
    selectedApplication,
    history,
    isSubMenuToggled,
    pathname,
    setIsSubMenuToggled,
    classesTree,
    urlParams,
  ]);

  return currentRouteSidebarProps as useSidebarContentReturnType;
};
useSidebarContent.displayName = 'useSidebarContent';
export default useSidebarContent;
