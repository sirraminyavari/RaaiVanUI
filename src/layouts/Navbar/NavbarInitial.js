import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createSelector } from 'reselect';
import * as Styled from './Navbar.styles';
import Logo_Fa from 'assets/images/cliqmind_logo_white.svg';
import Logo_En from 'assets/images/cliqmind_logo_white_en.svg';
import QuestionIcon from 'components/Icons/QuestionIcon/QuestionIcon';
import TeamIcon from 'components/Icons/TeamIcon/TeamIcon';
import ExitIcon from 'components/Icons/ExitIcon/ExitIcon';
import useWindow from 'hooks/useWindowContext';
import logoutAction from 'store/actions/auth/logoutAction';
import { getURL } from 'helpers/helpers';

const selectActivePath = createSelector(
  (state) => state.theme,
  (theme) => theme.activePath
);

const NavbarInitial = () => {
  const dispatch = useDispatch();
  const { RVGlobal, RV_RTL } = useWindow();
  const isSaas = RVGlobal.SAASBasedMultiTenancy;
  const activePath = useSelector(selectActivePath);

  //! Logs user out from application.
  const handleLogout = () => {
    dispatch(logoutAction());
  };

  const isHelpmeActive = activePath === getURL('Help');

  const linkTo = isHelpmeActive ? getURL('Applications') : getURL('Help');

  return (
    <Styled.NavbarContainer>
      <img
        src={isSaas ? (RV_RTL ? Logo_Fa : Logo_En) : RVGlobal.LogoURL}
        width={isSaas ? '120' : '60'}
        alt="cliqmind-logo"
      />
      <Styled.ExitAndHelpWrapper>
        <Styled.QuestionIconWrapper as={Link} to={linkTo}>
          {isHelpmeActive ? <TeamIcon size={27} /> : <QuestionIcon size={22} />}
        </Styled.QuestionIconWrapper>
        <Styled.ExitIconWrapper onClick={handleLogout}>
          <ExitIcon size={30} />
        </Styled.ExitIconWrapper>
      </Styled.ExitAndHelpWrapper>
    </Styled.NavbarContainer>
  );
};

export default NavbarInitial;
