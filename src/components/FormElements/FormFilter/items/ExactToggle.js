/**
 * Renders a toggle button for form filter.
 */
import { useContext } from 'react';
import * as Styled from '../FormFilter.styles';
import ToggleButton from '../../../Buttons/Toggle/Toggle';
import { WindowContext } from 'context/WindowProvider';

/**
 * @typedef PropType
 * @type {Object}
 * @property {function} onToggle - The callback function that fires on toggle.
 * @property {boolean} isChecked - The initial toggle value.
 */

/**
 *  @description Renders an 'Exact' toggle component.
 * @component
 * @param {PropType} props -Props that pass to Toggle.
 */
const ExactToggle = (props) => {
  const { onToggle, isChecked } = props;
  const { RVDic } = useContext(WindowContext);

  return (
    <Styled.FilterToggleContainer>
      <Styled.FilterToggleTitle>{RVDic.ExactSearch}</Styled.FilterToggleTitle>
      <ToggleButton onToggle={onToggle} initialCheck={!!isChecked} />
    </Styled.FilterToggleContainer>
  );
};

export default ExactToggle;
