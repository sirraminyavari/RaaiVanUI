import * as Styled from '../SingleSelectElement/SingleSelectInputStyle';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import ColorPicker from '../sharedItems/ColorPicker';
import { OptionContainer } from '../SingleSelectElement/SingleSelectInputStyle';
import styled from 'styled-components';
import { CV_DISTANT } from 'constant/CssVariables';

const MultipleSelectInput = ({
  index,
  option,
  handleOptionTextChange,
  handleOptionColorChange,
  handleRemoveOption,
}) => {
  const handleColorPickerOnSelect = (color) => {
    handleOptionColorChange && handleOptionColorChange(color, index);
  };

  return (
    <OptionContainer>
      <Styled.OptionTextContainer>
        <CheckboxSymbol />
        <Styled.OptionTextInput
          value={decodeBase64(option?.text)}
          onChange={(e) =>
            handleOptionTextChange(encodeBase64(e?.target.value), index)
          }
        />
        <Styled.RemoveIconButton onClick={() => handleRemoveOption(index)}>
          <CloseIcon outline={true} size={20} />
        </Styled.RemoveIconButton>
      </Styled.OptionTextContainer>

      <ColorPicker color={option?.color} onSelect={handleColorPickerOnSelect} />
    </OptionContainer>
  );
};
const CheckboxSymbol = styled.div`
  width: 1.25rem;
  aspect-ratio: 1/1;
  border-radius: 0.35rem;
  border: 1px solid ${CV_DISTANT};
  flex: 1.25rem;
`;
export default MultipleSelectInput;
