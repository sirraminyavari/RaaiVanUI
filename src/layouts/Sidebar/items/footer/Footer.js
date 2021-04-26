/**
 * Renders footer component for sidebar.
 */
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CirclePlusIcon from 'components/Icons/PlusIcon/PlusIcon';
import * as Styled from '../../Sidebar.styles';
import ManageButton from './ManageButton';
import SaveButton from './SaveButton';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import { createSelector } from 'reselect';
import { C_RED } from 'constant/Colors';

const selectSidebarContent = createSelector(
  (state) => state.theme,
  (theme) => theme.sidebarContent
);

const selectIsCreatingNode = createSelector(
  (state) => state.sidebarItems,
  (sidebarItems) => sidebarItems.isCreatingNode
);

const SidebarFooter = () => {
  const dispatch = useDispatch();
  const sidebarContent = useSelector(selectSidebarContent);
  const isCreatingNode = useSelector(selectIsCreatingNode);
  const { setNewNode, cancelNewNode } = sidebarMenuSlice.actions;

  const isManageContent = sidebarContent === 'manage';

  const handleOnClick = () => {
    if (isCreatingNode) {
      dispatch(cancelNewNode());
    } else {
      dispatch(setNewNode());
    }
  };

  return (
    <Styled.SidebarFooter>
      {isManageContent && (
        <Styled.PlusIconWrapper isCreating={isCreatingNode}>
          <CirclePlusIcon
            onClick={handleOnClick}
            size={30}
            color="#2B7BE4"
            className={isCreatingNode && C_RED}
          />
        </Styled.PlusIconWrapper>
      )}
      {isManageContent ? <SaveButton /> : <ManageButton />}
    </Styled.SidebarFooter>
  );
};

export default memo(SidebarFooter);
