import * as Styled from '../../Sidebar.styles';
import { TBG_WARM } from 'constant/Colors';
import { useDispatch } from 'react-redux';
import { themeSlice } from 'store/reducers/themeReducer';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import { setEditableTrees } from 'store/actions/sidebar/sidebarMenuAction';

const SaveButton = () => {
  const dispatch = useDispatch();
  const { setSidebarContent } = themeSlice.actions;
  const { closeOpenMenus } = sidebarMenuSlice.actions;

  const handleSaveButton = () => {
    dispatch(setEditableTrees('save'));
    dispatch(closeOpenMenus());
    dispatch(setSidebarContent('main'));
    //! Call api to save changes.
  };

  return (
    <Styled.FooterButton
      className={`${TBG_WARM}`}
      style={{ margin: '-0.2rem 0 0 0 ', padding: '0.8rem' }}
      onClick={handleSaveButton}>
      <Styled.FooterTitle>ثبت ویرایش</Styled.FooterTitle>
    </Styled.FooterButton>
  );
};

export default SaveButton;
