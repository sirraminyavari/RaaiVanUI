import * as Styled from '../../Sidebar.styles';
import EditIcon from 'components/Icons/EditIcon/Edit';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import { themeSlice } from 'store/reducers/themeReducer';
import { setEditableTrees } from 'store/actions/sidebar/sidebarMenuAction';

const selectIsSidebarOpen = createSelector(
  (state) => state.theme,
  (theme) => theme.isSidebarOpen
);

const ManageButton = () => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector(selectIsSidebarOpen);
  const { setSidebarContent, toggleSidebar } = themeSlice.actions;

  const handleManageButton = () => {
    dispatch(setEditableTrees());
    dispatch(setSidebarContent('manage'));
    if (!isSidebarOpen) {
      dispatch(toggleSidebar(true));
    }
  };

  return (
    <Styled.FooterButton
      className={`${isSidebarOpen && 'WarmBorder'}  BorderRadius4 `}
      onClick={handleManageButton}>
      <Styled.FooterIconWrapper>
        <EditIcon size={20} />
      </Styled.FooterIconWrapper>
      <Styled.FooterTitle>مدیریت دسته و کلاس ها</Styled.FooterTitle>
    </Styled.FooterButton>
  );
};

export default ManageButton;
