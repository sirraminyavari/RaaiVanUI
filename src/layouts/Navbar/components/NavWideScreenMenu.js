import { lazy, Fragment } from 'react';
import * as Styled from '../Navbar.styles';
import NavButtonComponent from './NavButtonComponent';
import NavButtonsList from './buttonsList';
import PopupMenu from 'components/PopupMenu/PopupMenu';
const ButtonActions = lazy(() =>
  import(/* webpackChunkName: "nav-button-actions"*/ './NavButtonActions')
);

const NavWideScreenMenu = () => {
  return (
    <Styled.WideScreenMenu>
      {NavButtonsList.map((btn) => {
        return (
          <Fragment key={btn.id}>
            {btn.actions ? (
              <PopupMenu trigger="click" align="bottom">
                <div>
                  <NavButtonComponent btnProps={btn} badge={btn.badge} />
                </div>
                <ButtonActions actions={btn.actions} />
              </PopupMenu>
            ) : (
              <NavButtonComponent btnProps={btn} badge={btn.badge} />
            )}
          </Fragment>
        );
      })}
    </Styled.WideScreenMenu>
  );
};

export default NavWideScreenMenu;
