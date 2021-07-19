import { useDispatch } from 'react-redux';
import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import CancelIcon from 'components/Icons/CloseIcon/CloseIcon';
import { themeSlice } from 'store/reducers/themeReducer';
import EditableTree from 'layouts/Sidebar/items/sidebarTree/editable/EditableTree';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import { MANAGE_CONTENT, MAIN_CONTENT } from 'constant/constants';

const SidebarManageContent = () => {
  const dispatch = useDispatch();
  const { setSidebarContent } = themeSlice.actions;
  const { closeOpenMenus } = sidebarMenuSlice.actions;

  const handleOnClick = () => {
    dispatch(closeOpenMenus());
    dispatch(
      setSidebarContent({ current: MAIN_CONTENT, prev: MANAGE_CONTENT })
    );
  };

  // TODO: add RVDic

  return (
    <>
      <Styled.SidebarTitle>
        <Styled.CenterIcon>
          <Styled.TitleText>ویرایش نوار راهبری</Styled.TitleText>
        </Styled.CenterIcon>
        <Styled.SettingWrapper onClick={handleOnClick}>
          <CancelIcon size={16} />
        </Styled.SettingWrapper>
      </Styled.SidebarTitle>
      <EditableTree />
    </>
  );
};

export default SidebarManageContent;
