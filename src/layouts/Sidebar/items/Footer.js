/**
 * Renders footer component for sidebar.
 */
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from 'components/Icons/EditIcon/Edit';
import CirclePlusIcon from 'components/Icons/PlusIcon/PlusIcon';
import * as Styled from '../Sidebar.styles';
import { themeSlice } from 'store/reducers/themeReducer';
import { createSelector } from 'reselect';
import { BG_WARM } from 'constant/Colors';

const selectIsSidebarOpen = createSelector(
  (state) => state.theme,
  (theme) => theme.isSidebarOpen
);

const selectSidebarContent = createSelector(
  (state) => state.theme,
  (theme) => theme.sidebarContent
);

const SidebarFooter = () => {
  const dispatch = useDispatch();
  const { setSidebarContent, toggleSidebar } = themeSlice.actions;
  const isSidebarOpen = useSelector(selectIsSidebarOpen);
  const sidebarContent = useSelector(selectSidebarContent);

  const isManageContent = sidebarContent === 'manage';

  const handleButtonClick = () => {
    if (!isManageContent) {
      dispatch(setSidebarContent('manage'));
      if (!isSidebarOpen) {
        dispatch(toggleSidebar(true));
      }
    }

    if (isManageContent) {
      dispatch(setSidebarContent('main'));
      //! Call api to save changes
    }
  };

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
      <Styled.FooterButton
        className={`${isSidebarOpen && 'WarmBorder'} ${
          isManageContent && BG_WARM
        } BorderRadius4 `}
        onClick={handleButtonClick}>
        {!isManageContent && (
          <Styled.FooterIconWrapper>
            <EditIcon size={20} />
          </Styled.FooterIconWrapper>
        )}
        <Styled.FooterTitle>
          {isManageContent ? 'ثبت ویرایش' : 'مدیریت دسته و کلاس ها'}
        </Styled.FooterTitle>
      </Styled.FooterButton>
    </Styled.SidebarFooter>
  );
};

export default memo(SidebarFooter);
