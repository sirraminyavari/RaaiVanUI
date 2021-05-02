import { useDispatch } from 'react-redux';
import * as Styled from '../../Sidebar.styles';
import CancelIcon from 'components/Icons/CloseIcon/CloseIcon';
import { themeSlice } from 'store/reducers/themeReducer';
import EditableTree from '../sidebarTree/editableTree/E-Tree';
import { setEditableTrees } from 'store/actions/sidebar/sidebarMenuAction';

const SidebarManageContent = () => {
  const dispatch = useDispatch();
  const { setSidebarContent } = themeSlice.actions;

  const handleOnClick = () => {
    dispatch(setEditableTrees('abort'));
    dispatch(setSidebarContent('main'));
  };

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