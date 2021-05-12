/**
 * Renders when sidebar is open.
 */
import { lazy } from 'react';
import { useSelector } from 'react-redux';
import * as Styled from '../Sidebar.styles';
import { createSelector } from 'reselect';

const selectSidebarContent = createSelector(
  (state) => state.theme,
  (theme) => theme.sidebarContent
);

const SidebarSetting = lazy(() =>
  import(
    /* webpackChunkName: "sidebar-setting-content"*/ './contents/setting/Setting'
  )
);
const SidebarMain = lazy(() =>
  import(/* webpackChunkName: "sidebar-main-content"*/ './contents/Main')
);

const SidebarManage = lazy(() =>
  import(/* webpackChunkName: "sidebar-manage-content"*/ './contents/Manage')
);

const getSidebarContent = (content) => {
  const rootContent = content.split('-')[0];

  switch (rootContent) {
    case 'setting':
      return <SidebarSetting />;
    case 'manage':
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
