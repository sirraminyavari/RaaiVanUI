import { useDispatch } from 'react-redux';
import * as Styled from 'layouts/Sidebar/Sidebar.styles';
import CancelIcon from 'components/Icons/CloseIcon/CloseIcon';
import EditableTree from 'layouts/Sidebar/items/sidebarTree/editable/EditableTree';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import { MANAGE_CONTENT, MAIN_CONTENT } from 'constant/constants';
import { useThemeSlice } from 'store/slice/theme';

const SidebarManageContent = () => {
  const dispatch = useDispatch();

  const {
    actions: { setSidebarContent },
  } = useThemeSlice();

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
