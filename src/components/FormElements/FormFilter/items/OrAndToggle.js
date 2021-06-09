import ToggleButton from 'components/Buttons/Toggle/Toggle';
import * as Styled from 'components/FormElements/FormFilter/FormFilter.styles';
import useWindow from 'hooks/useWindowContext';

/**
 * @typedef PropType
 * @type {Object}
 * @property {boolean} isChecked - The initial toggle value.
 */

/**
 *  @description Renders an 'OrAnd' button component.
 * @component
 * @param {PropType} props -Props that pass to button.
 */
const OrAndButton = (props) => {
  const { isChecked } = props;
  const { RVDic } = useWindow();

  return (
    <Styled.OrAndButtonContainer>
      <Styled.OrAndOption isChecked={!isChecked}>
        {RVDic.And}
      </Styled.OrAndOption>
      <Styled.OrAndOption isChecked={isChecked}>{RVDic.Or}</Styled.OrAndOption>
    </Styled.OrAndButtonContainer>
  );
};

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

  const handleToggle = (v) => {
    onToggle && onToggle(v);
  };

  return (
    <ToggleButton onToggle={handleToggle} initialCheck={isChecked}>
      <OrAndButton />
    </ToggleButton>
  );
};

export default OrAndToggle;
