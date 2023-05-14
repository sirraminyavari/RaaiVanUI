import { RVVariantProp } from '@cliqmind/rv-components';
import Button, { IButton } from './Button';

/**
 * @description a customized version of Button component that has a shadow in active mode
 */
const ShadowButton = ({ active, ...props }: IButton) => {
  return <Button active={active} variant={RVVariantProp.white} {...props} />;
};

export default ShadowButton;
