import PerfectScrollbar from 'react-perfect-scrollbar';
import useWindow from 'hooks/useWindowContext';
import './scrollbar.css';

/**
 * @description a wrapper for react-perfect-scrollbar. always use this component as scrollbar
 * @param {"left" | "right" | "reverse"} direction determines whether the scrollbar should be placed at left or at right
 * the default direction for RTL mode is 'left' and for LTR mode is 'right'
 * if you set the 'direction' equal to 'reverse', the scollbar will be placed at the opposite side of default direction
 * @param {boolean} brightMode set this to true when the scrollbar in placed on a dark background
 * @param {string} className extra class name for scrollbar container
 */
const ScrollBarProvider = ({
  direction,
  brightMode,
  className,
  ...restProps
}) => {
  const { RV_RTL } = useWindow();

  const dir = String(direction || ' ').toLowerCase();

  const alignLeft =
    dir === 'left'
      ? true
      : dir === 'right'
      ? false
      : dir === 'reverse'
      ? !RV_RTL
      : RV_RTL;

  const alignClass = alignLeft ? 'ps-align-left' : 'ps-align-right';
  const bgColorClass = brightMode ? 'ps-bg-bright' : 'ps-bg-normal';

  return (
    <>
      <PerfectScrollbar
        className={`${alignClass} ${bgColorClass} ${className || ' '}`}
        {...restProps}
      />
    </>
  );
};

export default ScrollBarProvider;
