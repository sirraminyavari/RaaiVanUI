/**
 * Renders a toggle button.
 */
import { RVSwitch, Switch } from '@cliqmind/rv-components';

/**
 *  @description Renders a Toggle component.
 * @component
 */
const ToggleButton = ({ children, disabled, title, ...rest }: RVSwitch) => {
  return (
    <>
      <Switch label={title} disabled={disabled} {...rest} />
      {children}
    </>
  );
};

ToggleButton.defaultProps = {
  value: false,
  disabled: false,
};

ToggleButton.displayName = 'ToggleButtonComponent';

export default ToggleButton;
