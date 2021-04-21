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
  import(/* webpackChunkName: "sidebar-setting-content"*/ './ContentSetting')
);
const SidebarMain = lazy(() =>
  import(/* webpackChunkName: "sidebar-main-content"*/ './ContentMain')
);

const SidebarManage = lazy(() =>
  import(/* webpackChunkName: "sidebar-manage-content"*/ './ContentManage')
);

const getSidebarContent = (title) => {
  switch (title) {
    case 'setting':
      return <SidebarSetting />;
    case 'manage':
      return <SidebarManage />;
    default:
      return <SidebarMain />;
  }
};

const SidebarOnOpen = () => {
  const contentTitle = useSelector(selectSidebarContent);

  return (
    <Styled.OpenContentWrapper>
      {getSidebarContent(contentTitle)}
    </Styled.OpenContentWrapper>
  );
};

export default SidebarOnOpen;
