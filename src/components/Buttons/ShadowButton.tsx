import { Button, RVButton, RVVariantProp } from '@cliqmind/rv-components';

/**
 * @description a customized version of Button component that has a shadow in active mode
 */
const ShadowButton = ({ active, ...props }: RVButton) => {
  return <Button active={active} variant={RVVariantProp.white} {...props} />;
};

export default ShadowButton;
