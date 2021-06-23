import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import EditIcon from 'components/Icons/EditIcons/Edit';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import { themeSlice } from 'store/reducers/themeReducer';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import { MANAGE_CONTENT, MAIN_CONTENT } from 'constant/constants';

const selectIsSidebarOpen = createSelector(
  (state) => state.theme,
  (theme) => theme.isSidebarOpen
);

const ManageButton = () => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector(selectIsSidebarOpen);
  const { setSidebarContent, toggleSidebar } = themeSlice.actions;
  const { closeOpenMenus } = sidebarMenuSlice.actions;

  const handleManageButton = () => {
    dispatch(closeOpenMenus());
    dispatch(
      setSidebarContent({ current: MANAGE_CONTENT, prev: MAIN_CONTENT })
    );
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
      <Styled.FooterTitle>مدیریت دسته و قالب ها</Styled.FooterTitle>
    </Styled.FooterButton>
  );
};

export default ManageButton;
