/**
 * Renders when sidebar is open.
 */
import { lazy } from 'react';
import { useSelector } from 'react-redux';
import * as Styled from '../Sidebar.styles';
import { createSelector } from 'reselect';
import { MANAGE_CONTENT, SETTING_CONTENT } from 'constant/constants';

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

const getSidebarContent = (content) => {
  const rootContent = content.split('-')[0];

  switch (rootContent) {
    case SETTING_CONTENT:
      return <SidebarSetting />;
    case MANAGE_CONTENT:
      return <SidebarManage />;
    default:
      return <SidebarMain />;
  }
};

const SidebarOnOpen = () => {
  const content = useSelector(selectSidebarContent);

  return (
    <Styled.OpenContentWrapper>
      {getSidebarContent(content.current)}
    </Styled.OpenContentWrapper>
  );
};

export default SidebarOnOpen;
