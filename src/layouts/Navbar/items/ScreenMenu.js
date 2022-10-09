/**
 * Renders a list of navbar buttons for non-mobile screens.
 */
import { Fragment, useMemo } from 'react';
import * as Styled from 'layouts/Navbar/Navbar.styles';
import MenuItem from './MenuItem';
import NavButtonsList from './buttonsList';
import PopupMenu from 'components/PopupMenu/PopupMenu';
import useWindow from 'hooks/useWindowContext';
import NavButtonMenu from './NavButtonMenu';
import NotificationsMenu from './NotificationsMenu';
import { useSelector } from 'react-redux';
// import Tooltip from 'components/Tooltip/react-tooltip/Tooltip';

const WideScreenMenu = () => {
  const { hasNavSide, isSidebarOpen } = useSelector((state) => state.theme);
  const { RVGlobal } = useWindow();
  const isSaas = (RVGlobal || {}).SAASBasedMultiTenancy;

  const popupMenuLeftOffset = useMemo(async () => {
    await new Promise((resolve) => setTimeout(() => resolve(), 500));
    if (!hasNavSide) return 10;
    if (isSidebarOpen) return 80;
    return 1;
  }, [hasNavSide, isSidebarOpen]);

  return (
    <Styled.WideScreenMenu>
      {NavButtonsList?.map((btn) => {
        const { actions, badge, index } = btn;

        //! Remove 'navigation' and 'question' in SAAS mode.
        if (isSaas && ['2', '3'].includes(btn.index)) {
          return null;
        }

        //! Remove 'teams' in ORG mode.
        if (!isSaas && ['4'].includes(btn.index)) {
          return null;
        }

        return (
          <Fragment key={index}>
            {actions ? (
              <PopupMenu
                key={popupMenuLeftOffset}
                arrowStyle="display: none;"
                menuStyle={{
                  border: 0,
                  backgroundColor: 'transparent',
                  padding: 0,
                }}
                trigger={actions.length ? 'hover' : 'click'}
                align="bottom"
                leftOffset={popupMenuLeftOffset}
              >
                <div>
                  <MenuItem
                    withArrow={!!actions.length}
                    btnProps={btn}
                    badge={badge}
                  />
                </div>
                {actions?.length ? (
                  <NavButtonMenu actions={actions} />
                ) : (
                  <NotificationsMenu />
                )}
              </PopupMenu>
            ) : (
              <MenuItem btnProps={btn} badge={badge} />
            )}
          </Fragment>
        );
      })}
      {/* <Tooltip
        tipId="nav-notifs-menu"
        multiline
        clickable
        event="click"
        effect="solid"
        place="bottom"
        type="dark">
        <MenuItem
          btnProps={{
            title: window.RVDic.Notifications,
            icon: 'notifications',
          }}
          badge={true}
        />
      </Tooltip> */}
    </Styled.WideScreenMenu>
  );
};

export default WideScreenMenu;
