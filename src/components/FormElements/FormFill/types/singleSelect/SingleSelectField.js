import { useContext, useState } from 'react';
import FormCell from '../../FormCell';
import { decodeBase64 } from 'helpers/helpers';
import RadioButtonIcon from 'components/Icons/RadioButtonIcon';
import { CV_GRAY } from 'constant/CssVariables';
import OnClickAway from 'components/OnClickAway/OnClickAway';
import { EditableContext } from '../../FormFill';
import SelectInputField from 'components/FormElements/ElementTypes/Select/SelectInputField';

const SingleSelectField = ({
  value,
  decodeInfo,
  decodeTitle,
  onAnyFieldChanged,
  elementId,
  type,
  save,
  ...props
}) => {
  const editable = useContext(EditableContext);
  const [isFocused, setIsFocused] = useState(false);
  const parseDecodeInfo = JSON.parse(decodeInfo);
  const { Options } = parseDecodeInfo || {};
  const normalizedOptions = Options?.map((x) => {
    const _x = {
      value: decodeBase64(x),
      label: decodeBase64(x),
    };
    return _x;
  });

  const decodeValue = decodeBase64(value);
  const selectedValue = normalizedOptions.find((x) => x.value === decodeValue);

  return (
    <FormCell
      iconComponent={<RadioButtonIcon color={CV_GRAY} size={'1.25rem'} />}
      title={decodeTitle}
      {...props}
    >
      <OnClickAway
        style={{}}
        onClick={() => {
          if (isFocused) return;
          setIsFocused(true);
        }}
      >
        <SelectInputField
          options={normalizedOptions}
          isEditable={editable}
          isFocused={isFocused}
          selectedValue={selectedValue}
          onChange={(event) => onAnyFieldChanged(elementId, event, type)}
          onBlur={() => save(elementId) && setIsFocused(false)}
        />
      </OnClickAway>
    </FormCell>
  );
};
export default SingleSelectField;
