/**
 * Renders when sidebar is open.
 */
import { lazy, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import * as Styled from '../Sidebar.styles';
import { MANAGE_CONTENT, SETTING_CONTENT } from 'constant/constants';
import { getFavoriteNodesCount } from 'store/actions/sidebar/sidebarMenuAction';

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
  const dispatch = useDispatch();
  const content = useSelector(selectSidebarContent);

  useEffect(() => {
    dispatch(getFavoriteNodesCount());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Styled.OpenContentWrapper data-tut="categories_and_templates">
      {getSidebarContent(content?.current)}
    </Styled.OpenContentWrapper>
  );
};

export default SidebarOnOpen;
