import { useEffect, forwardRef, useRef } from 'react';

const OnClickAway = forwardRef((props, ref) => {
  const { onAway, children, ...rest } = props;

  const containerRef = useRef();

  const handleClick = (e) => {
    if (containerRef?.current?.contains(e.target)) return;
    onAway(e);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={containerRef} {...rest}>
      {children}
    </div>
  );
});

export default OnClickAway;
