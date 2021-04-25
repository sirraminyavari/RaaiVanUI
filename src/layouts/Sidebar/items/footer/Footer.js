/**
 * Renders footer component for sidebar.
 */
import { memo } from 'react';
import { useSelector } from 'react-redux';
import CirclePlusIcon from 'components/Icons/PlusIcon/PlusIcon';
import * as Styled from '../../Sidebar.styles';
import ManageButton from './ManageButton';
import SaveButton from './SaveButton';

import { createSelector } from 'reselect';

const selectSidebarContent = createSelector(
  (state) => state.theme,
  (theme) => theme.sidebarContent
);

const SidebarFooter = () => {
  const sidebarContent = useSelector(selectSidebarContent);

  const isManageContent = sidebarContent === 'manage';

  const handleAddNew = () => {
    console.log('add new class');
  };

  return (
    <Styled.SidebarFooter>
      {isManageContent && (
        <Styled.PlusIconWrapper>
          <CirclePlusIcon onClick={handleAddNew} size={30} color="#2B7BE4" />
        </Styled.PlusIconWrapper>
      )}
      {isManageContent ? <SaveButton /> : <ManageButton />}
    </Styled.SidebarFooter>
  );
};

export default memo(SidebarFooter);
