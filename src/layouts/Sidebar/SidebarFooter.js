import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Styled from './Sidebar.styles';
import Icons from 'components/Icons';

const Footer = () => {
  const { isSidebarOpen } = useSelector((state) => state.theme);
  return (
    <Styled.SidebarFooter as={Link} to="#">
      <div style={{ marginRight: isSidebarOpen ? '0px' : '40px' }}>
        {Icons.edit}
      </div>
      <Styled.FooterTitle isSidebarOpen={isSidebarOpen}>
        مدیریت دسته و کلاس ها
      </Styled.FooterTitle>
    </Styled.SidebarFooter>
  );
};

export default Footer;
