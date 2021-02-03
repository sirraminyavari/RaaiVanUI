import { Link } from 'react-router-dom';
import * as Styled from './Sidebar.styles';
import Icons from 'components/Icons';

const Footer = ({ isOpen }) => {
  return (
    <Styled.SidebarFooter as={Link} to="#">
      <div style={{ marginRight: isOpen ? '0px' : '40px' }}>{Icons.edit}</div>
      <Styled.FooterTitle isOpen={isOpen}>
        مدیریت دسته و کلاس ها
      </Styled.FooterTitle>
    </Styled.SidebarFooter>
  );
};

export default Footer;
