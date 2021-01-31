import { useContext } from 'react';
import { ThemeContext } from 'context/ThemeProvider';
import {
  SidebarContainer,
  SidebarContentWrap,
  SidebarTitle,
  InnerWrapper,
} from './Sidebar.styles';
import SidebarHeader from './SidebarHeader';
import SidebarFooter from './SidebarFooter';
import SidebarOpenContent from './SidebarContent-Open';
import SidebarCloseContent from './SidebarContent-Close';

const Sidebar = () => {
  const { isOpen } = useContext(ThemeContext);
  return (
    <SidebarContainer width={isOpen ? 250 : 55}>
      <InnerWrapper isOpen={isOpen}>
        <SidebarContentWrap>
          <SidebarHeader />
          <SidebarTitle>
            {isOpen && <span>تیم شاهین</span>}
            <i
              className="fa fa-cog"
              aria-hidden="true"
              style={{ cursor: 'pointer', paddingRight: '5px' }}
            />
          </SidebarTitle>
          {isOpen ? <SidebarOpenContent /> : <SidebarCloseContent />}
        </SidebarContentWrap>
      </InnerWrapper>
      <SidebarFooter isOpen={isOpen} />
    </SidebarContainer>
  );
};

export default Sidebar;
