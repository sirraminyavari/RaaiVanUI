/**
 * A component that renders an icon alongside a popup menu in mobile screen.
 */
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import NavButtonsList from './buttonsList';
import MenuIcon from 'components/Icons/MenuIcon/HamburgerMenuIcon';
import NavbarIcons from './NavbarIcons/NavbarIcons';
import * as Styled from '../Navbar.styles';
import PopupMenu from 'components/PopupMenu/PopupMenu';
import { BG_RED, C_WHITE, TC_WARM } from 'constant/Colors';
import Badge from 'components/Badge/Badge';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { WindowContext } from 'context/WindowProvider';

const selectNavAlerts = createSelector(
  (state) => state.navbarAlert,
  (navbarAlert) => navbarAlert.alertsList
);

const NavMenus = () => {
  const alerts = useSelector(selectNavAlerts);
  const { RV_Float } = useContext(WindowContext);

  //! Make a flat list from a nested list.
  const flattenedButtons = NavButtonsList.reduce(
    (flatButtons, button) =>
      flatButtons.concat(
        button.actions
          ? button.actions.length
            ? button.actions
            : button
          : button
      ),
    []
  );

  return (
    <PopupMenu
      arrowClass="no-arrow"
      menuStyle={`border: 0; margin: 0.8rem 0.2rem;`}
      trigger="click">
      <div>
        <MenuIcon size={30} className={C_WHITE} style={{ cursor: 'pointer' }} />
      </div>
      <Styled.MenuOptionsWrapper>
        {flattenedButtons.map((btn, index) => {
          const { badge, linkTo, title, icon } = btn;
          const hasBadge = badge && alerts.length > 0;
          return (
            <Styled.NavMenuOption as={Link} to={linkTo} key={index}>
              {NavbarIcons[icon]({ className: TC_WARM, size: 20 })}
              {title}
              {hasBadge && (
                <Styled.BadgeWrapper
                  style={{ top: '0.9rem', [RV_Float]: '2.8rem' }}>
                  <Badge
                    style={{
                      fontSize: '0.7rem',
                      lineHeight: '1.4rem',
                      width: '1.2rem',
                      height: '1.2rem',
                    }}
                    value={alerts.length}
                    className={BG_RED}
                  />
                </Styled.BadgeWrapper>
              )}
            </Styled.NavMenuOption>
          );
        })}
      </Styled.MenuOptionsWrapper>
    </PopupMenu>
  );
};

export default NavMenus;
