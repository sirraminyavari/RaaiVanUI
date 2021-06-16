import { lazy, Suspense } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import useWindow from 'hooks/useWindowContext';
import 'assets/css/scrollbar/scrollbar.css';

const RTLSupport = lazy(() => import('./RTLSupport'));
const LTRSupport = lazy(() => import('./LTRSupport'));

const ScrollBarProvider = ({ children, ...restProps }) => {
  const { RV_RTL } = useWindow();

  return (
    <>
      {/* <Suspense fallback={<></>}>
        {RV_RTL ? <RTLSupport /> : <LTRSupport />}
      </Suspense> */}

      <PerfectScrollbar {...restProps}>{children}</PerfectScrollbar>
    </>
  );
};

export default ScrollBarProvider;
