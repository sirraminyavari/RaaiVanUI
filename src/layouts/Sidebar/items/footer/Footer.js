/**
 * Renders footer component for sidebar.
 */
import { memo } from 'react';
import { useSelector } from 'react-redux';
import * as Styled from '../../Sidebar.styles';
import ManageButton from './ManageButton';
import { createSelector } from 'reselect';

const selectSidebarContent = createSelector(
  (state) => state.theme,
  (theme) => theme.sidebarContent
);

const SidebarFooter = () => {
  const sidebarContent = useSelector(selectSidebarContent);

  const isMainContent = sidebarContent === 'main';

  return (
    <Styled.SidebarFooter>
      {isMainContent && <ManageButton />}
    </Styled.SidebarFooter>
  );
};

export default memo(SidebarFooter);
