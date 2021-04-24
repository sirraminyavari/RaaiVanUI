/**
 * Renders footer component for sidebar.
 */
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from 'components/Icons/EditIcon/Edit';
import * as Styled from '../Sidebar.styles';
import { themeSlice } from 'store/reducers/themeReducer';
import { createSelector } from 'reselect';

const selectIsSidebarOpen = createSelector(
  (state) => state.theme,
  (theme) => theme.isSidebarOpen
);

const SidebarFooter = () => {
  const dispatch = useDispatch();
  const { setSidebarContent, toggleSidebar } = themeSlice.actions;
  const isSidebarOpen = useSelector(selectIsSidebarOpen);

  const handleOnClick = () => {
    dispatch(setSidebarContent('manage'));
    if (!isSidebarOpen) {
      dispatch(toggleSidebar(true));
    }
  };

  return (
    <Styled.SidebarFooter>
      <Styled.FooterButton
        className={`${isSidebarOpen ? 'WarmBorder' : ''} BorderRadius4`}
        onClick={handleOnClick}>
        <Styled.FooterIconWrapper>
          <EditIcon size={20} />
        </Styled.FooterIconWrapper>
        <Styled.FooterTitle>مدیریت دسته و کلاس ها</Styled.FooterTitle>
      </Styled.FooterButton>
    </Styled.SidebarFooter>
  );
};

export default memo(SidebarFooter);
