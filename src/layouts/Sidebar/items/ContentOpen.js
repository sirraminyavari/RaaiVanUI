/**
 * Renders when sidebar is open.
 */
import { lazy, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import {
  MANAGE_CONTENT,
  PROFILE_CONTENT,
  SETTING_CONTENT,
} from 'constant/constants';
import { getFavoriteNodesCount } from 'store/actions/sidebar/sidebarMenuAction';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';

const selectSidebarContent = createSelector(
  (state) => state.theme,
  (theme) => theme.sidebarContent
);

const SidebarSetting = lazy(() =>
  import(
    /* webpackChunkName: "sidebar-setting-content"*/ './openSubContents/setting/Setting'
  )
);
const SidebarMain = lazy(() =>
  import(/* webpackChunkName: "sidebar-main-content"*/ './openSubContents/Main')
);

const SidebarManage = lazy(() =>
  import(
    /* webpackChunkName: "sidebar-manage-content"*/ './openSubContents/Manage'
  )
);

const SidebarProfile = lazy(() =>
  import(
    /* webpackChunkName: "sidebar-profile-content"*/ './openSubContents/profile/ProfileContent'
  )
);

const getSidebarContent = (content) => {
  const rootContent = content.split('-')[0];

  switch (rootContent) {
    case SETTING_CONTENT:
      return <SidebarSetting />;
    case MANAGE_CONTENT:
      return <SidebarManage />;
    case PROFILE_CONTENT:
      return <SidebarProfile />;
    default:
      return <SidebarMain />;
  }
};

const SidebarOnOpen = () => {
  const dispatch = useDispatch();
  const content = useSelector(selectSidebarContent);

  useEffect(() => {
    dispatch(getFavoriteNodesCount());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PerfectScrollbar
      style={{
        width: '100%',
        position: 'relative',
        padding: '0 1.5rem',
      }}
      data-tut="categories_and_templates">
      {getSidebarContent(content?.current)}
    </PerfectScrollbar>
  );
};

export default SidebarOnOpen;
