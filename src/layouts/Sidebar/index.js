import { Link } from 'react-router-dom';
import Logo from 'assets/icons/logo.svg';
import { useContext } from 'react';
import { ThemeContext } from 'context/ThemeProvider';
import {
  SidebarContainer,
  SidebarContent,
  SidebarHeader,
  ToggleArrow,
  SidebarTitle,
  SearchWrapper,
  SearchInput,
  SidebarFooter,
  InnerWrapper,
  FooterTitle,
} from './Sidebar.styles';

const Sidebar = () => {
  const { isOpen, setIsOpen } = useContext(ThemeContext);
  const ToggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <SidebarContainer width={isOpen ? 250 : 55}>
      <InnerWrapper isOpen={isOpen}>
        <SidebarContent>
          <SidebarHeader>
            {isOpen && <img src={Logo} width="120" alt="logo-icon" />}
            <ToggleArrow onClick={ToggleMenu} isOpen={isOpen}>
              <i
                className={`fa fa-arrow-${isOpen ? 'right' : 'left'}`}
                aria-hidden={true}
              />
            </ToggleArrow>
          </SidebarHeader>
          <SidebarTitle>
            {isOpen && <span>تیم شاهین</span>}
            <i
              className="fa fa-cog"
              aria-hidden="true"
              style={{ cursor: 'pointer' }}
            />
          </SidebarTitle>
          {isOpen && (
            <SearchWrapper>
              <SearchInput
                type="search"
                placeholder="جستجو در دسته و کلاس ها"
              />
              <i
                className="fa fa-filter"
                aria-hidden="true"
                style={{ color: '#707070' }}
              />
            </SearchWrapper>
          )}
        </SidebarContent>
        <SidebarFooter as={Link} to="#">
          <i
            className="fa fa-pencil"
            aria-hidden="true"
            style={{ marginRight: isOpen ? '0px' : '40px' }}
          />
          <FooterTitle isOpen={isOpen}>مدیریت دسته و کلاس ها</FooterTitle>
        </SidebarFooter>
      </InnerWrapper>
    </SidebarContainer>
  );
};

export default Sidebar;
