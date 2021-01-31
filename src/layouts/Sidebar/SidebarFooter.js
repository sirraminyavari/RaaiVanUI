import { Link } from 'react-router-dom';
import { SidebarFooter, FooterTitle } from './Sidebar.styles';

const Footer = ({ isOpen }) => {
  return (
    <SidebarFooter as={Link} to="#">
      <i
        className="fa fa-pencil"
        aria-hidden="true"
        style={{ marginRight: isOpen ? '0px' : '40px' }}
      />
      <FooterTitle isOpen={isOpen}>مدیریت دسته و کلاس ها</FooterTitle>
    </SidebarFooter>
  );
};

export default Footer;
