import type { SVGProps } from 'react';
import { FiMoreHorizontal, FiMoreVertical } from 'react-icons/fi';

export type IShowMoreIcon = SVGProps<SVGSVGElement> & {
  dir?: 'vertical' | 'horizontal';
  size?: number | string;
};

const ShowMoreIcon = ({ dir: direction, ...rest }: IShowMoreIcon) => {
  switch (direction) {
    case 'vertical':
      return <FiMoreVertical {...rest} />;
    default:
      return <FiMoreHorizontal {...rest} />;
  }
};

export default ShowMoreIcon;
