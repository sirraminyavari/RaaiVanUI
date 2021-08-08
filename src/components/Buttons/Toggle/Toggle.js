/**
 * Renders a toggle button.
 */
import PropTypes from 'prop-types';
import {
  // useEffect,
  cloneElement,
} from 'react';
import * as Styled from './Toggle.styles';
import useToggle from 'hooks/useToggle';

/**
 * @typedef PropType
 * @type {Object}
 * @property {function} onToggle - The callback function that fires on toggle.
 * @property {boolean} initialCheck - The initial toggle value.
 * @property {boolean} disable - If true, button is disabled.
 */

/**
 *  @description Renders a Toggle component.
 * @component
 * @param {PropType} props -Props that pass to Toggle.
 */
const ToggleButton = (props) => {
  const { onToggle, initialCheck, children, disable, ...rest } = props;
  const [isOn, setToggle] = useToggle(initialCheck);

  const toggle = (e) => {
    if (!!disable) return;
    setToggle((toggle) => !toggle);
    onToggle && onToggle(e.target.checked);
  };

  // useEffect(() => {
  //   onToggle && onToggle(isOn);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isOn]);

  return (
    <Styled.ToggleLabel>
      <Styled.ToggleInput type="checkbox" checked={isOn} onChange={toggle} />
      {!!children ? (
        cloneElement(children, { isChecked: isOn })
      ) : (
        <Styled.ToggleButton isChecked={isOn} {...rest} />
      )}
    </Styled.ToggleLabel>
  );
};

ToggleButton.propTypes = {
  onToggle: PropTypes.func,
  initialCheck: PropTypes.bool,
  disable: PropTypes.bool,
};

ToggleButton.defaultProps = {
  initialCheck: false,
  disable: false,
};

ToggleButton.displayName = 'ToggleButtonComponent';

export default ToggleButton;
