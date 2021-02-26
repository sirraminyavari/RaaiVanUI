/**
 * Renders footer component for sidebar.
 */
import EditIcon from 'components/Icons/EditIcon/Edit';
import { BG_WARM } from 'constant/Colors';
import * as Styled from '../Sidebar.styles';

const SidebarFooter = () => {
  return (
    <Styled.SidebarFooter className={BG_WARM}>
      <Styled.FooterIconWrapper>
        <EditIcon size={20} />
      </Styled.FooterIconWrapper>
      <Styled.FooterTitle>مدیریت دسته و کلاس ها</Styled.FooterTitle>
    </Styled.SidebarFooter>
  );
};

export default SidebarFooter;
