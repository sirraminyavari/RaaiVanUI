//   direction,
//   brightMode,
//   className,
//   scrollEndOptions: { top, offset, onEndReach } = {},
//   onScrollY /* this function has no use */,

import { FC } from 'react';

export interface IScrollEndOptionsProps {
  top?: number;
  offset?: number;
  onEndReach?: () => void;
}

export interface IScrollBarProviderProps {
  direction?: 'left' | 'right' | 'reverse';
  brightMode?: boolean;
  className?: any;
  scrollEndOptions?: IScrollEndOptionsProps;
  onScrollY?: () => void;
  children?: ReactNode;
}

const ScrollBarProvider: FC<IScrollBarProviderProps>;
export default ScrollBarProvider;
