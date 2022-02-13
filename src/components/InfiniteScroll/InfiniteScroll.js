import { useEffect, useState, useRef, Children } from 'react';
import PropTypes from 'prop-types';

/**
 * @component
 * @description - Infinite Scroll
 * InfiniteScroll component will register an listener on the last child passed to the component (`props.children`)
 * that will trigger a functionality when element is intersecting the viewport
 *
 * @param {JSX.Element[]} props.children
 * @param {boolean} [props.hasMore=false] Determines whether trigger `onScrollEnd` event or not
 * @param {number} [props.pageNumber=0] An useState getter
 * @param {function} [props.setPageNumber] An useState setter
 * @param {event} [props.onScrollEnd] function to trigger, when scrolled to the last child
 * @param {number | number[]} [props.threshold=0.75] - A number or array of numbers between 0 - 1 that determines when to trigger `onScrollEnd`
 * @return {JSX.Element}
 */
const InfiniteScroll = ({
  children,
  hasMore,
  pageNumber,
  setPageNumber,
  threshold,
  onScrollEnd,
}) => {
  const [lastElement, setLastElement] = useState(null);
  // const [isIntersecting, setIsIntersecting] = useState(0);

  const observer = useRef(
    new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        console.log(first);
        if (first.isIntersecting && first.intersectionRatio < 0.75) {
          setPageNumber((no) => no + 1);
        }
      },
      { threshold }
    )
  );

  useEffect(() => {
    if (hasMore) {
      onScrollEnd();
    }
  }, [pageNumber]);

  useEffect(() => {
    const currentElement = lastElement;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [lastElement]);

  const renderChildren = (allChildren) => {
    if (allChildren.length > 0)
      return allChildren.map((Child, i) => {
        return i === allChildren.length - 1 ? (
          <div key={`infinite-scroll-component-${i}`} ref={setLastElement}>
            {Child}
          </div>
        ) : (
          Child
        );
      });
  };

  return <>{renderChildren(Children.toArray(children))}</>;
};

InfiniteScroll.defaultProps = {
  hasMore: false,
  pageNumber: 0,
  setPageNumber: () => {},
  onScrollEnd: () => {},
  threshold: 0.75,
};
InfiniteScroll.propTypes = {
  hasMore: PropTypes.bool,
  pageNumber: PropTypes.number.isRequired,
  setPageNumber: PropTypes.func.isRequired,
  onScrollEnd: PropTypes.func.isRequired,
  threshold: PropTypes.oneOf([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number),
  ]),
};

export default InfiniteScroll;
