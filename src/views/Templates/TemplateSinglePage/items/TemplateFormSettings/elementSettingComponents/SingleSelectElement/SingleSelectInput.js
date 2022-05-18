import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import * as Styled from './SingleSelectInputStyle';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import { OptionContainer, Separator } from './SingleSelectInputStyle';
import ColorPicker from '../sharedItems/ColorPicker';

const SingleSelectInput = ({
  index,
  option,
  handleOptionTextChange,
  handleOptionColorChange,
  handleOptionMinChange,
  handleOptionMaxChange,
  handleRemoveOption,
}) => {
  const handleColorPickerOnSelect = (color) => {
    handleOptionColorChange && handleOptionColorChange(color, index);
  };

  return (
    <OptionContainer>
      <Styled.OptionTextContainer>
        <Styled.CheckboxSymbol />
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

      <Separator />

      <Styled.MinMaxInputContainer hasTitle={index === 0}>
        {index === 0 && (
          <Styled.MinMaxInputTitle
            value={encodeBase64(option?.max)}
            onChange={(e) =>
              handleOptionMaxChange(decodeBase64(e?.target?.value, index))
            }
          >
            {'بیشینه پاسخ'}
          </Styled.MinMaxInputTitle>
        )}
        <Styled.MinMaxInput />
      </Styled.MinMaxInputContainer>

      <Styled.MinMaxInputContainer hasTitle={index === 0}>
        {index === 0 && (
          <Styled.MinMaxInputTitle
            value={encodeBase64(option?.min)}
            onChange={(e) =>
              handleOptionMinChange(decodeBase64(e?.target?.value, index))
            }
          >
            >{'کمینه پاسخ'}
          </Styled.MinMaxInputTitle>
        )}
        <Styled.MinMaxInput />
      </Styled.MinMaxInputContainer>
    </OptionContainer>
  );
};
export default SingleSelectInput;
