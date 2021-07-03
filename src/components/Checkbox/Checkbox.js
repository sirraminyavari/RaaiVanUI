/**
 * Renders a customized checkbox component.
 */
import * as Styled from './Checkbox.styles';

/**
 * @typedef PropType
 * @property {boolean} isChecked - A boolean that shows if checkbox is checked or not.
 * @property {function} changeHandler -A callback function that returns checkbox changed value.
 */

/**
 *  @description Renders a customized checkbox component.
 * @component
 * @param {PropType} props
 */
const Checkbox = (props) => {
  const { isChecked, changeHandler } = props;
  return (
    <Styled.CheckboxContainer>
      <label>Eng:</label>
      <input
        type="checkbox"
        defaultChecked={isChecked}
        onChange={changeHandler}
      />
    </Styled.CheckboxContainer>
  );
};

export default Checkbox;
