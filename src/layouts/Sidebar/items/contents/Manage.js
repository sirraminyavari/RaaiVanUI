import { useDispatch } from 'react-redux';
import * as Styled from '../../Sidebar.styles';
import CancelIcon from 'components/Icons/CloseIcon/CloseIcon';
import { themeSlice } from 'store/reducers/themeReducer';
import EditableTree from '../sidebarTree/editable/E-Tree';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';

const SidebarManageContent = () => {
  const dispatch = useDispatch();
  const { setSidebarContent } = themeSlice.actions;
  const { closeOpenMenus } = sidebarMenuSlice.actions;

  const handleOnClick = () => {
    dispatch(closeOpenMenus());
    dispatch(setSidebarContent('main'));
  };

  return (
    <div style={{ marginLeft: '3%' }}>
      <Styled.SidebarTitle>
        <Styled.CenterIcon>
          <Styled.TitleText>ویرایش نوار راهبری</Styled.TitleText>
        </Styled.CenterIcon>
        <Styled.SettingWrapper onClick={handleOnClick}>
          <CancelIcon size={16} />
        </Styled.SettingWrapper>
      </Styled.SidebarTitle>
      <EditableTree />
    </div>
  );
};

export default SidebarManageContent;
