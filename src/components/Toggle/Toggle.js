/**
 * Renders a toggle component.
 */
import PropTypes from 'prop-types';
import * as Styled from './Toggle.styles';
import ToggleButton from 'components/Buttons/Toggle/Toggle';

/**
 * @typedef PropType
 * @type {Object}
 * @property {function} onToggle - The callback function that fires on toggle.
 * @property {boolean} isChecked - The initial toggle value.
 * @property {string} title - The title of toggle component.
 * @property {string} containerClass - The classes for container.
 * @property {string} titleClass - The classes for title.
 * @property {boolean} disable - If true, button is disabled.
 * @property {boolean} clickableLabel - If true, toggle on label click.
 */

/**
 *  @description Renders a 'Toggle'  component.
 * @component
 * @param {PropType} props -Props that pass to Toggle.
 */
const Toggle = ({
  onToggle,
  isChecked,
  title,
  containerClass,
  titleClass,
  titleStyle,
  disable,
  clickableLabel,
}) => {
  // const { onToggle, isChecked, title, containerClass, titleClass } = props;

  return (
    <Styled.ToggleContainer className={containerClass}>
      <Styled.ToggleTitleWrapper
        isClickable={!!clickableLabel}
        onClick={() => clickableLabel && onToggle(!isChecked)}
        className={titleClass}
        style={titleStyle}>
        {title}
      </Styled.ToggleTitleWrapper>
      <ToggleButton
        disabled={!!disable}
        onToggle={onToggle}
        value={!!isChecked}
      />
    </Styled.ToggleContainer>
  );
};

Toggle.propTypes = {
  onToggle: PropTypes.func,
  isChecked: PropTypes.bool,
  title: PropTypes.string,
  containerClass: PropTypes.string,
  titleClass: PropTypes.string,
  disable: PropTypes.bool,
};

Toggle.displayName = 'ToggleComponent';

export default Toggle;
