/**
 * Renders sub-menus(branches) for each main(root) menu item.
 */
import SidebarIcons from 'components/Icons/SidebarIcons/SidebarIcons';
import { Link } from 'react-router-dom';
import * as Styled from '../../../Sidebar.styles';
import { decodeBase64 } from 'helpers/helpers';

const ReadableSubBranch = ({ isOpen, menuList }) => {
  return (
    <Styled.SubMenuContainer isOpen={isOpen} itemsCount={menuList.length}>
      {menuList.map((menu) => {
        return (
          <Styled.SubMenu
            key={menu.NodeTypeID}
            className="BorderRadius4 subMenu"
            forwardedAs={Link}
            to={`/classes/${menu.NodeTypeID}`}>
            <div>
              {menu.IconName && SidebarIcons[menu.IconName]({ size: 20 })}
              {menu.IconURL && (
                <Styled.MenuItemImage
                  src={menu.IconURL}
                  style={{ maxWidth: '1.3rem' }}
                  alt="sub-menu-icon"
                />
              )}
              <Styled.SubMenuTitleWrapper>
                {decodeBase64(menu.TypeName)}
              </Styled.SubMenuTitleWrapper>
            </div>
          </Styled.SubMenu>
        );
      })}
    </Styled.SubMenuContainer>
  );
};

export default ReadableSubBranch;
