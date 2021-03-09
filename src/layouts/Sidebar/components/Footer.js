/**
 * Renders footer component for sidebar.
 */
import { Link } from 'react-router-dom';
import EditIcon from 'components/Icons/EditIcon/Edit';
import { BG_WARM } from 'constant/Colors';
import * as Styled from '../Sidebar.styles';
import withTheme from 'components/withTheme/withTheme';

const SidebarFooter = (props) => {
  return (
    <Styled.SidebarFooter>
      <Styled.OpenFooterButton
        className={`${
          props.theme.states.isSidebarOpen ? BG_WARM : ''
        } BorderRadius4`}
        as={Link}
        to="/configuration/map">
        <Styled.FooterIconWrapper>
          <EditIcon size={20} />
        </Styled.FooterIconWrapper>
        <Styled.FooterTitle>مدیریت دسته و کلاس ها</Styled.FooterTitle>
      </Styled.OpenFooterButton>
      <Styled.CloseFooterButton
        className={`${BG_WARM} Circle`}
        as={Link}
        to="/configuration/map">
        <EditIcon size={20} />
      </Styled.CloseFooterButton>
    </Styled.SidebarFooter>
  );
};

export default withTheme(SidebarFooter);
