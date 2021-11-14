/**
 * Renders a toggle button.
 */
import PropTypes from 'prop-types';
import { cloneElement } from 'react';
import * as Styled from './Toggle.styles';

/**
 * @typedef PropType
 * @type {Object}
 * @property {function} onToggle - The callback function that fires on toggle.
 * @property {Boolean | null} value - The toggle value.
 * @property {Boolean} disabled - If true, button is disabled.
 */

/**
 *  @description Renders a Toggle component.
 * @component
 * @param {PropType} props -Props that pass to Toggle.
 */
const ToggleButton = (props) => {
  const { onToggle, children, disabled, value, ...rest } = props;

  const toggle = (e) => {
    if (!!disabled) return;
    const toggleValue = e.target.checked;
    onToggle && onToggle(toggleValue);
  };

  return (
    <Styled.ToggleLabel>
      <Styled.ToggleInput type="checkbox" checked={value} onChange={toggle} />
      {!!children ? (
        cloneElement(children, { isChecked: value })
      ) : (
        <Styled.ToggleButton isChecked={value} {...rest} />
      )}
    </Styled.ToggleLabel>
  );
};

ToggleButton.propTypes = {
  onToggle: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.bool, null]),
  disabled: PropTypes.bool,
};

ToggleButton.defaultProps = {
  value: false,
  disabled: false,
};

ToggleButton.displayName = 'ToggleButtonComponent';

export default ToggleButton;
