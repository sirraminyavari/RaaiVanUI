/**
 * Renders sub-menus(branches) for each main(root) menu item.
 */
import SidebarIcons from 'components/Icons/SidebarIcons/SidebarIcons';
import { Link } from 'react-router-dom';
import * as Styled from '../../../Sidebar.styles';
import { decodeBase64 } from 'helpers/helpers';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

const selectActivePath = createSelector(
  (state) => state.theme,
  (theme) => theme.activePath
);

const ReadableSubBranch = ({ isOpen, menuList }) => {
  const activePath = useSelector(selectActivePath);

  return (
    <Styled.SubMenuContainer isOpen={isOpen} itemsCount={menuList.length}>
      {menuList.map((menu) => {
        const isActive = activePath === `/classes/${menu.NodeTypeID}`;
        return (
          <Styled.SubMenu
            isActive={isActive}
            key={menu.NodeTypeID}
            forwardedAs={Link}
            to={`/classes/${menu.NodeTypeID}`}>
            <div style={{ display: 'flex', width: '100%' }}>
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
