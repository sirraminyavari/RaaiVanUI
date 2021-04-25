import * as Styled from '../../Sidebar.styles';
import { BG_WARM } from 'constant/Colors';
import { useDispatch } from 'react-redux';
import { themeSlice } from 'store/reducers/themeReducer';
import { setEditableTrees } from 'store/actions/sidebar/sidebarMenuAction';

const SaveButton = () => {
  const dispatch = useDispatch();
  const { setSidebarContent } = themeSlice.actions;

  const handleSaveButton = () => {
    dispatch(setEditableTrees('save'));
    dispatch(setSidebarContent('main'));
    //! Call api to save changes.
  };

  return (
    <Styled.FooterButton
      className={`${BG_WARM} BorderRadius4 `}
      onClick={handleSaveButton}>
      <Styled.FooterTitle>ثبت ویرایش</Styled.FooterTitle>
    </Styled.FooterButton>
  );
};

export default SaveButton;
