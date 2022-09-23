import type { SVGProps } from 'react';
import { BiLinkExternal } from 'react-icons/bi';

interface IExternalLinkIcon extends SVGProps<SVGSVGElement> {
  size?: string;
}

function ExternalLinkIcon({ size, ...props }: IExternalLinkIcon): JSX.Element {
  return (
    <>
      <BiLinkExternal width={size || '1em'} height={size || '1em'} {...props} />
    </>
  );
}
ExternalLinkIcon.displayName = 'ExternalLinkIcon';
export default ExternalLinkIcon;
