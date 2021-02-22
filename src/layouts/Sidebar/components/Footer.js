import { useSelector } from 'react-redux';
import EditIcon from 'components/Icons/EditIcon/Edit';
import { BG_WARM } from 'constant/Colors';
import * as Styled from '../Sidebar.styles';

const SidebarFooter = () => {
  const { isSidebarOpen } = useSelector((state) => state.theme);
  return (
    <Styled.SidebarFooter className={BG_WARM}>
      <div style={{ marginRight: isSidebarOpen ? '0' : '3rem' }}>
        <EditIcon size={20} />
      </div>
      <Styled.FooterTitle isSidebarOpen={isSidebarOpen}>
        مدیریت دسته و کلاس ها
      </Styled.FooterTitle>
    </Styled.SidebarFooter>
  );
};

export default SidebarFooter;
