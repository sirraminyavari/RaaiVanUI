import { useDispatch } from 'react-redux';
import * as Styled from './Navbar.styles';
import Logo_Fa from 'assets/images/cliqmind_logo_white.svg';
import Logo_En from 'assets/images/cliqmind_logo_white_en.svg';
import QuestionIcon from 'components/Icons/QuestionIcon/QuestionIcon';
import ExitIcon from 'components/Icons/ExitIcon/ExitIcon';
import useWindow from 'hooks/useWindowContext';
import logoutAction from 'store/actions/auth/logoutAction';

const NavbarInitial = () => {
  const dispatch = useDispatch();
  const { RVGlobal, RV_RTL } = useWindow();
  const isSaas = RVGlobal.SAASBasedMultiTenancy;

  //! Logs user out from application.
  const handleLogout = () => {
    dispatch(logoutAction());
  };

  return (
    <Styled.NavbarContainer>
      <img
        src={isSaas ? (RV_RTL ? Logo_Fa : Logo_En) : RVGlobal.LogoURL}
        width={isSaas ? '120' : '60'}
        alt="logo-icon"
      />
      <Styled.ExitAndHelpWrapper>
        <Styled.QuestionIconWrapper>
          <QuestionIcon size={22} />
        </Styled.QuestionIconWrapper>
        <Styled.ExitIconWrapper onClick={handleLogout}>
          <ExitIcon size={30} />
        </Styled.ExitIconWrapper>
      </Styled.ExitAndHelpWrapper>
    </Styled.NavbarContainer>
  );
};

export default NavbarInitial;
