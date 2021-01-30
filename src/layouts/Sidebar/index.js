import { Link } from 'react-router-dom';
import Logo from 'assets/icons/logo.svg';
import { useState } from 'react';
import {
  SidebarContainer,
  SidebarContent,
  SidebarHeader,
  ToggleArrow,
  SidebarTitle,
  SearchWrapper,
  SearchInput,
  SidebarFooter,
} from './Sidebar.styles';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const ToggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <SidebarContainer width={isOpen ? 250 : 80}>
      <SidebarContent>
        <SidebarHeader>
          <img src={Logo} width="120" alt="logo-icon" />
          <ToggleArrow onClick={ToggleMenu} isOpen={isOpen}>
            <i
              className={`fa fa-arrow-${isOpen ? 'right' : 'left'}`}
              aria-hidden={true}
            />
          </ToggleArrow>
        </SidebarHeader>
        <SidebarTitle>
          <span>تیم شاهین</span>
          <i
            className="fa fa-cog"
            aria-hidden="true"
            style={{ cursor: 'pointer' }}
          />
        </SidebarTitle>
        <SearchWrapper>
          <SearchInput type="search" placeholder="جستجو در دسته و کلاس ها" />
          <i
            className="fa fa-filter"
            aria-hidden="true"
            style={{ color: '#707070' }}
          />
        </SearchWrapper>
      </SidebarContent>
      <SidebarFooter as={Link} to="#">
        <i className="fa fa-pencil" aria-hidden="true" />
        <span style={{ marginRight: '5px' }}>مدیریت دسته و کلاس ها</span>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;
