/**
 * Renders a list of navbar buttons for non-mobile screens.
 */
import { lazy, Fragment, memo } from 'react';
import * as Styled from '../Navbar.styles';
import MenuItem from './MenuItem';
import NavButtonsList from './buttonsList';
import PopupMenu from 'components/PopupMenu/PopupMenu';

const FixActions = lazy(() =>
  import(/* webpackChunkName: "nav-fix-actions"*/ './FixActions')
);
const AlertActions = lazy(() =>
  import(/* webpackChunkName: "nav-alert-actions"*/ './AlertActions')
);

const WideScreenMenu = () => {
  return (
    <Styled.WideScreenMenu>
      {NavButtonsList.map((btn) => {
        const { actions, badge, index } = btn;
        return (
          <Fragment key={index}>
            {actions ? (
              <PopupMenu
                menuStyle={`border: 0; background-color: transparent;`}
                trigger={actions.length ? 'hover' : 'click'}
                align="bottom">
                <div>
                  <MenuItem
                    withArrow={!!actions.length}
                    btnProps={btn}
                    badge={badge}
                  />
                </div>
                {actions.length ? (
                  <FixActions actions={actions} />
                ) : (
                  <AlertActions />
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

export default memo(WideScreenMenu);