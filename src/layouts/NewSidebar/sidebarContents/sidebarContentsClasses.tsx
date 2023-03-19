import {
  Avatar,
  BookmarkSvg,
  CMLogoSvg,
  FileTrayFullSvg,
  GridSvg,
  HomeSvg,
  MenuSvg,
  RVAvatar,
  RVColorProp,
  RVSizeProp,
  RVVariantProp,
  SocialSvg,
} from '@cliqmind/rv-components';
import {
  CLASSES_PATH,
  CLASSES_WITHID_PATH,
  HOME_PATH,
} from 'constant/constants';
import { SidebarContentFunction } from './useSidebarContent';
import SidebarContentDefault from './sidebarContentsDefault';
import { decodeBase64 } from 'helpers/helpers';

const SidebarContentClasses: SidebarContentFunction<{
  sidebarTree: Record<string, any>;
}> = ({
  isSubMenuToggled,
  setIsSubMenuToggled,
  history,
  urlParams,
  sidebarTree = {},
}) => {
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
          }
        : {
            Icon: CMLogoSvg,
            title: '',
            onClick: () => {},
            noIndicator: true,
          },

      {
        Icon: HomeSvg,
        noIndicator: false,
        onClick: () => {
          history.push(CLASSES_PATH);
        },
      },
      {
        Icon: SocialSvg,
        noIndicator: false,
        onClick: () => {
          history.push(HOME_PATH);
        },
      },
    ],
    mainSidebarSecondaryLinks: [...(defaults?.mainSidebarSecondaryLinks || [])],
    subSidebarLinks: [
      ...(defaults?.subSidebarLinks || []),
      {
        badge: 1265,
        title: 'Everything',
        Icon: GridSvg,
        onClick: () => {
          history.push(CLASSES_PATH);
        },
      },
      {
        badge: 1265,
        title: 'Bookmarked',
        Icon: BookmarkSvg,
        onClick: () => {
          history.push(`${CLASSES_PATH}?bookmarked=1`);
        },
      },
      {
        badge: 1265,
        title: 'Drafts',
        Icon: FileTrayFullSvg,
        onClick: () => {
          history.push(`${CLASSES_PATH}?drafts=1`);
        },
      },
      ...sidebarTree.map((item) => {
        const title = decodeBase64(item.TypeName);
        if (item.Sub)
          return {
            title: title,
            Icon: ClassAvatar(item.IconURL),
            onClick: () => {
              history.push(CLASSES_WITHID_PATH.replace(':id', item.NodeTypeID));
            },

            childItems: item.Sub?.map((subItem) => ({
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
          };
      }),
    ],
  };
};

export default SidebarContentClasses;
