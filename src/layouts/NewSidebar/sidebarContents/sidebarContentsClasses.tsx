import {
  Avatar,
  BookmarkSvg,
  BriefcaseSvg,
  ChartColumnBarSvg,
  ChatBubblesSvg,
  CMLogoSvg,
  DashboardSvg,
  FileTrayFullSvg,
  GridSvg,
  HammerWrenchSvg,
  HomeSvg,
  MenuSvg,
  NotificationSvg,
  RVAvatar,
  RVColorProp,
  RVSizeProp,
  RVVariantProp,
  SettingsSvg,
  ShapesSvg,
  SocialSvg,
} from '@cliqmind/rv-components';
import {
  CLASSES_PATH,
  CLASSES_WITHID_PATH,
  DASHBOARD_PATH,
  HOME_PATH,
  MESSAGES_PATH,
  REPORTS_PATH,
} from 'constant/constants';
import { SidebarContentFunction } from './useSidebarContent';
import SidebarContentDefault from './sidebarContentsDefault';
import { decodeBase64 } from 'helpers/helpers';
import useWindowContext from 'hooks/useWindowContext';
import { useEffect } from 'react';

const SidebarContentClasses: SidebarContentFunction<{
  sidebarTree: Record<string, any>;
}> = ({
  isSubMenuToggled,
  setIsSubMenuToggled,
  history,
  urlParams,
  sidebarTree = {},
}) => {
  const { RVGlobal } = useWindowContext();
  const defaults = SidebarContentDefault({
    history,
    isSubMenuToggled,
    setIsSubMenuToggled,
    urlParams,
  });

  const ClassAvatar =
    (avatarURL: string) =>
    ({ className, ...props }: RVAvatar) =>
      (
        <div
          className={className}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBlock: '.25rem',
          }}
        >
          <Avatar
            {...props}
            src={avatarURL}
            size={RVSizeProp.small}
            style={{
              width: '1.5rem',
            }}
            variant={RVVariantProp.white}
            color={RVColorProp.platinum}
          />
        </div>
      );

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
      {
        Icon: NotificationSvg,
        noIndicator: false,
        onClick: () => {
          history.push(HOME_PATH);
        },
        path: '/notifications',
      },
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
            {
              Icon: BriefcaseSvg,
              noIndicator: false,
              onClick: () => {
                history.push(HOME_PATH);
              },
              path: '/work',
            },
            {
              Icon: ChatBubblesSvg,
              noIndicator: false,
              onClick: () => {
                history.push(MESSAGES_PATH);
              },
              path: MESSAGES_PATH,
            },
            {
              Icon: ShapesSvg,
              noIndicator: false,
              onClick: () => {
                history.push(HOME_PATH);
              },
              path: '/shapes',
            },
            {
              Icon: HammerWrenchSvg,
              noIndicator: false,
              onClick: () => {
                history.push('/templates/settings');
              },
              path: '/templates/settings',
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
            {
              Icon: SettingsSvg,
              noIndicator: false,
              onClick: () => {
                history.push(HOME_PATH);
              },
              path: '/settings-2/',
            },
          ]
        : []),
    ],
    mainSidebarSecondaryLinks: [...(defaults?.mainSidebarSecondaryLinks || [])],
    subSidebarLinks: [
      ...(defaults?.subSidebarLinks || []),
      {
        badge: sidebarTree.length,
        title: 'Everything',
        Icon: GridSvg,
        onClick: () => {
          history.push(CLASSES_PATH);
        },
        path: `${CLASSES_PATH}`,
        id: `${CLASSES_PATH}`,
      },
      {
        badge: 1265,
        title: 'Bookmarked',
        Icon: BookmarkSvg,
        onClick: () => {
          history.push(`${CLASSES_PATH}?bookmarked=1`);
        },
        id: `${CLASSES_PATH}?bookmarked=1`,
        path: `${CLASSES_PATH}?bookmarked=1`,
      },
      {
        badge: 1265,
        title: 'Drafts',
        Icon: FileTrayFullSvg,
        onClick: () => {
          history.push(`${CLASSES_PATH}?drafts=1`);
        },
        path: `${CLASSES_PATH}?drafts=1`,
        id: `${CLASSES_PATH}?drafts=1`,
      },
      ...sidebarTree.map((item) => {
        const title = decodeBase64(item.TypeName);
        if (item.Sub)
          return {
            id: item.NodeTypeID,
            path: CLASSES_WITHID_PATH.replace(':id', item.NodeTypeID),
            title: title,
            Icon: ClassAvatar(item.IconURL),
            onClick: () => {
              history.push(CLASSES_WITHID_PATH.replace(':id', item.NodeTypeID));
            },

            childItems: item.Sub?.map((subItem) => ({
              id: subItem.NodeTypeID,
              path: CLASSES_WITHID_PATH.replace(':id', item.NodeTypeID),
              title: decodeBase64(subItem.TypeName),
              Icon: ClassAvatar(subItem.IconURL),
              onClick: () => {
                history.push(
                  CLASSES_WITHID_PATH.replace(':id', subItem.NodeTypeID)
                );
              },
            })),
          };
        else
          return {
            title: title,
            Icon: ClassAvatar(item.IconURL),
            onClick: () => {
              history.push(CLASSES_WITHID_PATH.replace(':id', item.NodeTypeID));
            },
            id: CLASSES_WITHID_PATH.replace(':id', item.NodeTypeID),
            path: CLASSES_WITHID_PATH.replace(':id', item.NodeTypeID),
          };
      }),
    ],
  };
};

export default SidebarContentClasses;
