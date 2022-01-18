import ToggleButton from 'components/Buttons/Toggle/Toggle';
import * as Styled from 'components/FormElements/FormFilter/FormFilter.styles';
import BinaryButton from 'components/Buttons/binary/BinaryButton';
import useWindow from 'hooks/useWindowContext';

/**
 * @typedef PropType
 * @type {Object}
 * @property {function} onToggle - The callback function that fires on toggle.
 * @property {boolean} isChecked - The initial toggle value.
 */

/**
 *  @description Renders an 'OrAnd' toggle component.
 * @component
 * @param {PropType} props -Props that pass to Toggle.
 */
const OrAndToggle = (props) => {
  const { onToggle, isChecked } = props;
  const { RVDic } = useWindow();

  const { And, Or } = RVDic || {};
  const binaryOptions = [And, Or];

  const handleToggle = (v) => {
    onToggle && onToggle(v);
  };

  return (
    <Styled.OrAndToggleWrapper>
      <ToggleButton onToggle={handleToggle} initialCheck={isChecked}>
        <BinaryButton
          isChecked={isChecked}
          options={binaryOptions}
          className="form-filter-toggle"
        />
      </ToggleButton>
    </Styled.OrAndToggleWrapper>
  );
};

export default OrAndToggle;
