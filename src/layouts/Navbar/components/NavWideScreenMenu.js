import { lazy, Fragment } from 'react';
import * as Styled from '../Navbar.styles';
import NavButtonComponent from './NavButtonComponent';
import NavButtonsList from './buttonsList';
import Tooltip from 'components/Tooltip/Tooltip';
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
              <Tooltip
                content={() => <ButtonActions actions={btn.actions} />}
                delay={100}
                offsetY={35}>
                <NavButtonComponent btnProps={btn} badge={btn.badge} />
              </Tooltip>
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
