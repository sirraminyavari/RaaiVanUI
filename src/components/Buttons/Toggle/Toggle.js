/**
 * Renders a toggle button.
 */
import PropTypes from 'prop-types';
import { useState, useEffect, cloneElement } from 'react';
import * as Styled from './Toggle.styles';
import useToggle from 'hooks/useToggle';

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
  const { onToggle, initialCheck, children, ...rest } = props;
  const [isOn, setToggle] = useToggle(initialCheck);

  const toggle = () => {
    setToggle();
  };

  useEffect(() => {
    onToggle && onToggle(isOn);
  }, [isOn]);

  return (
    <Styled.ToggleLabel>
      <Styled.ToggleInput type="checkbox" checked={isOn} onClick={toggle} />
      {!!children ? (
        cloneElement(children, { isChecked: isOn })
      ) : (
        <Styled.ToggleButton isChecked={isOn} {...rest} />
      )}
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
