import { Link } from 'react-router-dom';
import { SidebarFooter, FooterTitle } from './Sidebar.styles';
import Icons from 'components/Icons';

const Footer = ({ isOpen }) => {
  return (
    <SidebarFooter as={Link} to="#">
      <div style={{ marginRight: isOpen ? '0px' : '40px' }}>
        {Icons['edit']}
      </div>
      <FooterTitle isOpen={isOpen}>مدیریت دسته و کلاس ها</FooterTitle>
    </SidebarFooter>
  );
};

export default Footer;
