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
 * @property {strin} titleClass - The classes for title.
 */

/**
 *  @description Renders a 'Toggle'  component.
 * @component
 * @param {PropType} props -Props that pass to Toggle.
 */
const Toggle = (props) => {
  const { onToggle, isChecked, title, containerClass, titleClass } = props;

  return (
    <Styled.ToggleContainer className={containerClass}>
      <Styled.ToggleTitleWrapper className={titleClass}>
        {title}
      </Styled.ToggleTitleWrapper>
      <ToggleButton onToggle={onToggle} initialCheck={!!isChecked} />
    </Styled.ToggleContainer>
  );
};

Toggle.propTypes = {
  onToggle: PropTypes.func,
  isChecked: PropTypes.bool,
  title: PropTypes.string,
  containerClass: PropTypes.string,
  titleClass: PropTypes.string,
};

Toggle.displayName = 'ToggleComponent';

export default Toggle;
