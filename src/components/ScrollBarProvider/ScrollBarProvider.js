import PerfectScrollbar from 'react-perfect-scrollbar';
import useWindow from 'hooks/useWindowContext';
import './scrollbar.css';

/**
 * @description a wrapper for react-perfect-scrollbar. always use this component as scrollbar
 * @param {"left" | "right"} direction determines whether the scrollbar should be placed at left or at right
 */
const ScrollBarProvider = ({ direction, ...restProps }) => {
  const { RV_RTL } = useWindow();

  const alignLeft = direction
    ? String(direction).toLowerCase() === 'left'
    : RV_RTL;

  return (
    <>
      <PerfectScrollbar
        className={alignLeft ? 'ps-align-left' : 'ps-align-right'}
        {...restProps}
      />
    </>
  );
};

export default ScrollBarProvider;
