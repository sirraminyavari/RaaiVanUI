import {
  useEffect,
  forwardRef,
  useRef,
  ReactNode,
  HTMLAttributes,
  DetailedHTMLProps,
} from 'react';

export type IOnClickAway = Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  'ref'
> & {
  children?: ReactNode;

  onAway?: (event: MouseEvent) => void;
};
const OnClickAway = forwardRef<HTMLDivElement, IOnClickAway>(
  ({ onAway, children, ...rest }, _ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleClick = (event: MouseEvent) => {
      if (containerRef?.current?.contains(event.target as Node)) return;
      onAway && onAway(event);
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
  }
);
OnClickAway.displayName = 'OnClickAway';

export default OnClickAway;
