import { useEffect, forwardRef } from 'react';

const OnClickAway = forwardRef((props, ref) => {
  const { onAway, children, ...rest } = props;

  const handleClick = (e) => {
    if (ref.current.contains(e.target)) return;
    onAway();
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return (
    <div ref={ref} {...rest}>
      {children}
    </div>
  );
});

export default OnClickAway;
