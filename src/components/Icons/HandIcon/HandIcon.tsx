import type { SVGProps } from 'react';
import { IoHandRightOutline } from 'react-icons/io5';

interface IHandIcon extends SVGProps<SVGSVGElement> {
  size?: string;
}

function HandIcon({ ...props }: IHandIcon): JSX.Element {
  return <IoHandRightOutline {...props} />;
}

HandIcon.displayName = 'HandIcon';
export default HandIcon;
