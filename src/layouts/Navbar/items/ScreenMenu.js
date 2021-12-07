/**
 * Renders a list of navbar buttons for non-mobile screens.
 */
import { Fragment } from 'react';
import * as Styled from 'layouts/Navbar/Navbar.styles';
import MenuItem from './MenuItem';
import NavButtonsList from './buttonsList';
import PopupMenu from 'components/PopupMenu/PopupMenu';
import useWindow from 'hooks/useWindowContext';
import NavButtonMenu from './NavButtonMenu';
import NotificationsMenu from './NotificationsMenu';
// import Tooltip from 'components/Tooltip/react-tooltip/Tooltip';

const WideScreenMenu = () => {
  const { RVGlobal } = useWindow();
  const isSaas = (RVGlobal || {}).SAASBasedMultiTenancy;

  return (
    <Styled.WideScreenMenu>
      {NavButtonsList?.map((btn) => {
        const { actions, badge, index } = btn;

        //! Remove 'navigation', 'question' and 'dashboard' in SAAS mode.
        if (isSaas && ['2', '3', '6'].includes(btn.index)) {
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
                arrowStyle="display: none;"
                menuStyle="border: 0; background-color: transparent;"
                trigger={actions.length ? 'hover' : 'click'}
                align="bottom">
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
