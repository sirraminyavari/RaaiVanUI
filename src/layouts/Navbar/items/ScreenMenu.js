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

const WideScreenMenu = () => {
  const { RVGlobal } = useWindow();
  const isSaas = (RVGlobal || {}).SAASBasedMultiTenancy;

  return (
    <Styled.WideScreenMenu>
      {NavButtonsList?.map((btn) => {
        const { actions, badge, index } = btn;
        if (isSaas && ['2', '3', '6'].includes(btn.index)) {
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
    </Styled.WideScreenMenu>
  );
};

export default WideScreenMenu;
