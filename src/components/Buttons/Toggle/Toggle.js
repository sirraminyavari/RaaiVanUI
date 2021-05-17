/**
 * Renders a toggle button.
 */
import { useState, useEffect } from 'react';
import * as Styled from './Toggle.styles';

/**
 * @typedef PropType
 * @type {Object}
 * @property {function} onToggle - The callback function that fires on toggle.
 */

/**
 *  @description Renders a Toggle component.
 * @component
 * @param {PropType} props -Props that pass to Toggle.
 */
const Toggle = (props) => {
  const { onToggle, ...rest } = props;
  const [isChecked, setIsChecked] = useState(false);

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

export default Toggle;
