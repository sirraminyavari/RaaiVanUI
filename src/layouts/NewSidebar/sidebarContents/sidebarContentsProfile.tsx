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
  PersonCircleSvg,
  PersonSvg,
  RocketSvg,
  SettingsSvg,
  ShieldSvg,
  ShirtSvg,
  SocialSvg,
} from '@cliqmind/rv-components';
import {
  CLASSES_PATH,
  CONFIG_GROUPS_PATH,
  CONFIG_USERS_PATH,
  DASHBOARD_PATH,
  HOME_PATH,
  MESSAGES_PATH,
  PROFILE_USER,
  REPORTS_PATH,
  TEAM_SETTINGS_PATH,
  TEMPLATES_SETTING_PATH,
  USER_SECURITY_PATH,
} from 'constant/constants';
import { SidebarContentFunction } from './useSidebarContent';
import SidebarContentDefault from './sidebarContentsDefault';
import useWindowContext from 'hooks/useWindowContext';
import SettingIcon from 'components/Icons/SettingIcon/Setting';

const SidebarContentProfile: SidebarContentFunction<{}> = ({
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
      !isSubMenuToggled
        ? {
            Icon: MenuSvg,
            title: '',
            onClick: () => {
              setIsSubMenuToggled((prev) => !prev);
            },
            noIndicator: true,
            menuTrigger: true,
            path: '/logo',
          }
        : {
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
    subSidebarLinks: [
      {
        title: 'Profile',
        Icon: (props) => <PersonCircleSvg {...props} outline={false} />,
        onClick: () => {},
        id: `/${PROFILE_USER}`,
        path: `/${PROFILE_USER}`,
      },
      {
        title: 'Security & Authentication',
        Icon: (props) => <ShieldSvg {...props} outline />,
        onClick: () => {
          history.push(`${USER_SECURITY_PATH}`);
        },
        id: `${USER_SECURITY_PATH}`,
        path: `${USER_SECURITY_PATH}`,
      },
      {
        title: 'Personalization',
        Icon: (props) => <ShirtSvg {...props} outline />,
        onClick: () => {
          history.push(`/${PROFILE_USER}/customization`);
        },
        id: `/${PROFILE_USER}/customization`,
        path: `/${PROFILE_USER}/customization`,
      },
      // {
      //   title: 'Missions',
      //   Icon: (props) => <RocketSvg {...props} outline />,
      //   onClick: () => {
      //     history.push(`/${PROFILE_USER}`);
      //   },
      //   id: `/${PROFILE_USER}Missions`,
      //   path: `/${PROFILE_USER}`,
      // },
    ],
  };
};

export default SidebarContentProfile;
