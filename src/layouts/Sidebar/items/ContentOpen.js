/**
 * Renders when sidebar is open.
 */
import { lazy, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import {
  MANAGE_CONTENT,
  PROFILE_CONTENT,
  SETTING_CONTENT,
  TEMPLATE_CONTENT,
} from 'constant/constants';
import { getFavoriteNodesCount } from 'store/actions/sidebar/sidebarMenuAction';
import ScrollBarProvider from 'components/ScrollBarProvider/ScrollBarProvider';
import usePreventScroll from 'hooks/usePreventScroll';
import useWindowContext from 'hooks/useWindowContext';

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

const SidebarTemplate = lazy(() =>
  import(
    /* webpackChunkName: "sidebar-template-single"*/ './openSubContents/template/TemplateSetting'
  )
);

//! Provides the content of the sidebar.
const getSidebarContent = (content) => {
  const rootContent = content.split('-')[0];

  switch (rootContent) {
    case SETTING_CONTENT:
      return <SidebarSetting />;
    case MANAGE_CONTENT:
      return <SidebarManage />;
    case PROFILE_CONTENT:
      return <SidebarProfile />;
    case TEMPLATE_CONTENT:
      return <SidebarTemplate />;
    default:
      return <SidebarMain />;
  }
};

/**
 * Renders content for the sidebar in open mode.
 * @returns {React.Component}
 */
const SidebarOnOpen = () => {
  const containerRef = useRef();
  const dispatch = useDispatch();
  const content = useSelector(selectSidebarContent);

  const { RV_Float } = useWindowContext();

  usePreventScroll(containerRef);

  useEffect(() => {
    dispatch(getFavoriteNodesCount());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollBarProvider
      direction={RV_Float}
      brightMode={true}
      style={{
        width: '100%',
        position: 'relative',
        padding: '0 1.5rem',
      }}
      data-tut="categories_and_templates"
    >
      <div ref={containerRef}>{getSidebarContent(content?.current)}</div>
    </ScrollBarProvider>
  );
};

export default SidebarOnOpen;
