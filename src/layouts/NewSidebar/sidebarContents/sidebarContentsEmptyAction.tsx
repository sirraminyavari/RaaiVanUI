import {
  ChartColumnBarSvg,
  ChatBubblesSvg,
  CMLogoSvg,
  DashboardSvg,
  HammerWrenchSvg,
  HomeSvg,
  MenuSvg,
  NotificationSvg,
  PeopleCircleSvg,
  PersonSvg,
  SettingsSvg,
  SocialSvg,
} from '@cliqmind/rv-components';
import {
  CLASSES_PATH,
  CONFIG_GROUPS_PATH,
  CONFIG_USERS_PATH,
  DASHBOARD_PATH,
  HOME_PATH,
  MESSAGES_PATH,
  REPORTS_PATH,
  TEAM_SETTINGS_PATH,
  TEMPLATES_SETTING_PATH,
} from 'constant/constants';
import { SidebarContentFunction } from './useSidebarContent';
import SidebarContentDefault from './sidebarContentsDefault';
import useWindowContext from 'hooks/useWindowContext';

const SidebarContentsEmptyAction: SidebarContentFunction<{}> = ({
  isSubMenuToggled,
  setIsSubMenuToggled,
  history,
  urlParams,
  selectedApplication,
  classesTree,
}) => {
  const { RVGlobal } = useWindowContext();
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

      {
        Icon: HomeSvg,
        noIndicator: false,
        onClick: () => {
          history.push(CLASSES_PATH);
        },
        path: CLASSES_PATH,
      },
      // {
      //   Icon: NotificationSvg,
      //   noIndicator: false,
      //   onClick: () => {
      //     history.push(HOME_PATH);
      //   },
      //   path: '/notifications',
      // },
      {
        Icon: SocialSvg,
        noIndicator: false,
        onClick: () => {
          history.push(HOME_PATH);
        },
        path: HOME_PATH,
      },
      ...(RVGlobal.IsSystemAdmin
        ? [
            // {
            //   Icon: BriefcaseSvg,
            //   noIndicator: false,
            //   onClick: () => {
            //     history.push(HOME_PATH);
            //   },
            //   path: '/work',
            // },
            {
              Icon: ChatBubblesSvg,
              noIndicator: false,
              onClick: () => {
                history.push(MESSAGES_PATH);
              },
              path: MESSAGES_PATH,
            },
            // {
            //   Icon: ShapesSvg,
            //   noIndicator: false,
            //   onClick: () => {
            //     history.push(HOME_PATH);
            //   },
            //   path: '/shapes',
            // },
            {
              Icon: HammerWrenchSvg,
              noIndicator: false,
              onClick: () => {
                history.push(TEMPLATES_SETTING_PATH);
              },
              path: TEMPLATES_SETTING_PATH,
            },
            {
              Icon: DashboardSvg,
              noIndicator: false,
              onClick: () => {
                history.push(DASHBOARD_PATH);
              },
              path: DASHBOARD_PATH,
            },
            {
              Icon: ChartColumnBarSvg,
              noIndicator: false,
              onClick: () => {
                history.push(REPORTS_PATH);
              },
              path: REPORTS_PATH,
            },
            ...(selectedApplication?.ApplicationID
              ? [
                  {
                    Icon: SettingsSvg,
                    noIndicator: false,
                    onClick: () => {
                      history.push(
                        TEAM_SETTINGS_PATH.replace(
                          ':id',
                          selectedApplication?.ApplicationID
                        )
                      );
                    },
                    path: TEAM_SETTINGS_PATH.replace(
                      ':id',
                      selectedApplication?.ApplicationID
                    ),
                  },
                ]
              : []),
          ]
        : []),
    ],
    mainSidebarSecondaryLinks: [...(defaults?.mainSidebarSecondaryLinks || [])],
    subSidebarLinks: [],
  };
};

export default SidebarContentsEmptyAction;
