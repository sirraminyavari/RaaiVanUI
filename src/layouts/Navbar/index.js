import { useContext, lazy, Suspense } from 'react';
import { RVGlobalContext } from 'context/RVGlobalProvider';
import NavbarStyle from 'assets/jss/components/NavbarStyle';
const LogedOutNav = lazy(() => import('./components/LogedOutNav'));
const LogedInNav = lazy(() => import('./components/LogedInNav'));

const Navbar = () => {
  const { IsAuthenticated: isAuth } = useContext(RVGlobalContext);
  return (
    <div
      className="WarmBackgroundColor RevTextAlign rv-not-printable"
      style={NavbarStyle.navbarContainer}>
      <Suspense fallback={<div>Loading...</div>}>
        {isAuth ? <LogedInNav /> : <LogedOutNav />}
      </Suspense>
    </div>
  );
};

export default Navbar;
