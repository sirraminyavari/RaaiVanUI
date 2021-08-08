import PropTypes from 'prop-types';
import * as Styled from './Slider.styles';

/**
 * @typedef PropType
 * @type {Object}
 * @property {number} min - The minimum number allowed for range input.
 * @property {number} max - The maximum number allowed for range input.
 * @property {number} step - The step for slider change.
 * @property {string | number} value - The range input value.
 * @property {function} onChange - The callback function that fires on every change on range input.
 */

/**
 *  @description Renders a slider component.
 * @component
 * @param {PropType} props -Props that pass to slider.
 */
const Slider = (props) => {
  const { min, max, step, value, onChange } = props;

  const handleOnChange = (e) => {
    const value = e.target.value;
    onChange && onChange(e, value);
  };

  return (
    <Styled.RangeSlider
      type="range"
      min={min}
      max={max}
      step={step}
      value={+value}
      onChange={handleOnChange}
    />
  );
};

Slider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
};

Slider.defaultProps = {};

export default Slider;
