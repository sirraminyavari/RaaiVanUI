import PerfectScrollbar from 'react-perfect-scrollbar';
import useWindow from 'hooks/useWindowContext';
import './scrollbar.css';
import { useMemo, useRef } from 'react';

/**
 * @description a wrapper for react-perfect-scrollbar. always use this component as scrollbar
 * @param {"left" | "right" | "reverse"} [props.direction] determines whether the scrollbar should be placed at left or at right
 * the default direction for RTL mode is 'left' and for LTR mode is 'right'
 * if you set the 'direction' equal to 'reverse', the scollbar will be placed at the opposite side of default direction
 * @param {boolean} [props.brightMode] set this to true when the scrollbar in placed on a dark background
 * @param {string} [props.className] extra class name for scrollbar container
 * @param {boolean} [props.scrollEndOptions.top] if equal to 'true', scroll end will be calculated based on top of container
 * @param {number} [props.scrollEndOptions.offset] the offset in pixels to check if scroll is near the end
 * @param {event} [props.scrollEndOptions.onEndReach] handler of the scroll-end event
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
  const containerRef = useRef();

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

  const scroller = useMemo(
    () => (event) => {
      if (!containerRef.current) return;
      const element = containerRef.current;
      const isMacWebkit =
        navigator.userAgent.indexOf('Macintosh') !== -1 &&
        navigator.userAgent.indexOf('WebKit') !== -1;
      const isFirefox = navigator.userAgent.indexOf('firefox') !== -1;
      // prevent from scrolling parent elements
      function scrollWheelHandler(event) {
        let deltaX =
          event.deltaX * -1 || // wheel event
          event.wheelDeltaX / 4 || // mousewheel
          0; // property not defined
        let deltaY =
          event.deltaY * -1 || // wheel event
          event.wheelDeltaY / 4 || // mousewheel event in Webkit
          (event.wheelDeltaY === undefined && // if there is no 2D property then
            event.wheelDelta / 4) || // use the 1D wheel property
          event.detail * -1 || // Firefox DOMMouseScroll event
          0; // property not defined
        if (isMacWebkit) {
          deltaX /= 15;
          deltaY /= 15;
        }
        event.currentTarget.scrollTop -= deltaY;
        event.currentTarget.scrollLeft -= deltaX;
        if (isFirefox && event.type !== 'DOMMouseScroll')
          element.removeEventListener(
            'DOMMouseScroll',
            scrollWheelHandler,
            false
          );

        if (event.preventDefault) event.preventDefault();
        if (event.stopPropagation) event.stopPropagation();
        event.cancelBubble = true; // IE events
        event.returnValue = false; // IE events
        return false;
      }
      // Register mousewheel event handlers.
      element.onwheel = scrollWheelHandler; // Future browsers
      element.onmousewheel = scrollWheelHandler; // Most current browsers
      if (isFirefox) {
        // Firefox only
        element.scrollTop = 0;
        element.addEventListener('DOMMouseScroll', scrollWheelHandler, false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [containerRef.current]
  );

  return (
    <>
      <PerfectScrollbar
        containerRef={(el) => (containerRef.current = el)}
        className={`${alignClass} ${bgColorClass} ${className || ' '}`}
        onScrollY={
          typeof onEndReach !== 'function' ? undefined : isCloseToBottom
        }
        onScroll={(e) => {
          scroller(e);
        }}
        {...restProps}
      />
    </>
  );
};

export default ScrollBarProvider;
