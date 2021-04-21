/**
 * Renders footer component for sidebar.
 */
import { useSelector, useDispatch } from 'react-redux';
import EditIcon from 'components/Icons/EditIcon/Edit';
import { BG_WARM } from 'constant/Colors';
import * as Styled from '../Sidebar.styles';
import withTheme from 'components/withTheme/withTheme';
import { themeSlice } from 'store/reducers/themeReducer';

const SidebarFooter = (props) => {
  const dispatch = useDispatch();
  const { setSidebarContent } = themeSlice.actions;

  const handleOnClick = () => {
    dispatch(setSidebarContent('manage'));
  };
  return (
    <Styled.SidebarFooter>
      <Styled.OpenFooterButton
        className={`${
          props.theme.states.isSidebarOpen ? BG_WARM : ''
        } BorderRadius4`}
        onClick={handleOnClick}>
        <Styled.FooterIconWrapper>
          <EditIcon size={20} />
        </Styled.FooterIconWrapper>
        <Styled.FooterTitle>مدیریت دسته و کلاس ها</Styled.FooterTitle>
      </Styled.OpenFooterButton>
      <Styled.CloseFooterButton className={`${BG_WARM} Circle`}>
        <EditIcon size={20} />
      </Styled.CloseFooterButton>
    </Styled.SidebarFooter>
  );
};

export default withTheme(SidebarFooter);
