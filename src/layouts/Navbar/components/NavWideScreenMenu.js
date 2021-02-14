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
              <PopupMenu
                content={() => <ButtonActions actions={btn.actions} />}
                delay={100}
                menuStyle="background-color: #fff; border: none;">
                <NavButtonComponent btnProps={btn} badge={btn.badge} />
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
