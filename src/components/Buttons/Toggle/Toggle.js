/**
 * Renders a toggle button.
 */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import * as Styled from './Toggle.styles';

/**
 * @typedef PropType
 * @type {Object}
 * @property {function} onToggle - The callback function that fires on toggle.
 * @property {boolean} initialCheck - The initial toggle value.
 */

/**
 *  @description Renders a Toggle component.
 * @component
 * @param {PropType} props -Props that pass to Toggle.
 */
const Toggle = (props) => {
  const { onToggle, initialCheck, ...rest } = props;
  const [isChecked, setIsChecked] = useState(initialCheck);

  const toggle = () => {
    setIsChecked((checked) => !checked);
  };

  useEffect(() => {
    onToggle && onToggle(isChecked);
  }, [isChecked]);

  return (
    <Styled.ToggleLabel>
      <Styled.ToggleInput
        type="checkbox"
        checked={isChecked}
        onClick={toggle}
      />
      <Styled.ToggleButton isChecked={isChecked} {...rest} />
    </Styled.ToggleLabel>
  );
};

Toggle.propTypes = {
  onToggle: PropTypes.func,
  initialCheck: PropTypes.bool,
};

Toggle.defaultProps = {
  initialCheck: false,
};

export default Toggle;
