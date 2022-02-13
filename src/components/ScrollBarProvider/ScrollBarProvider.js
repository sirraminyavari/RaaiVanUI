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
 * @param {boolean} scrollEndOptions.top if equal to 'true', scroll end will be calculated based on top of container
 * @param {number} scrollEndOptions.offset the offset in pixels to check if scroll is near the end
 * @param {event} scrollEndOptions.onEndReach handler of the scroll-end event
 */
const ScrollBarProvider = ({
  direction,
  brightMode,
  className,
  scrollEndOptions: { top, offset, onEndReach } = {},
  onScrollY /* this function has no use */,
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

  const isCloseToBottom = (elem) => {
    const computedStyle = getComputedStyle(elem);

    const scrollTop = elem.scrollTop;
    const scrollPosition = scrollTop + elem.offsetHeight;
    const totalHeight =
      elem.scrollHeight +
      parseInt(computedStyle.getPropertyValue('padding-top'), 10) +
      parseInt(computedStyle.getPropertyValue('padding-bottom'), 10) +
      parseInt(computedStyle.getPropertyValue('border-top-width'), 10) +
      parseInt(computedStyle.getPropertyValue('border-bottom-width'), 10);

    const _offset = +(offset ? offset : 0);

    const endReached =
      (top && scrollTop >= 0 && scrollTop <= _offset) ||
      (!top && scrollPosition >= totalHeight - _offset);

    if (endReached) onEndReach();
  };

  return (
    <>
      <PerfectScrollbar
        className={`${alignClass} ${bgColorClass} ${className || ' '}`}
        onScrollY={
          typeof onEndReach !== 'function' ? undefined : isCloseToBottom
        }
        {...restProps}
      />
    </>
  );
};

export default ScrollBarProvider;
