import { CV_GRAY } from 'constant/CssVariables';
import { decodeBase64 } from 'helpers/helpers';
import React, { useContext, useState } from 'react';
import FormCell from '../../FormCell';
import CheckBoxIconIo from 'components/Icons/CheckBoxIconIo';
import OnClickAway from 'components/OnClickAway/OnClickAway';
import { EditableContext } from '../../FormFill';
import SelectInputField from 'components/FormElements/ElementTypes/Select/SelectInputField';

const MultiSelectField = ({
  value,
  decodeInfo,
  decodeTitle,
  onAnyFieldChanged,
  elementId,
  type,
  save,
  ...props
}) => {
  const parseDecodeInfo = JSON.parse(decodeInfo);
  const [isFocused, setIsFocused] = useState(false);
  const { Options } = parseDecodeInfo || {};
  const decodeValue = decodeBase64(value);

  const normalizedOptions = Options?.map((x) => {
    const _x = {
      value: decodeBase64(x),
      label: decodeBase64(x),
    };
    return _x;
  });
  const selectedOptions =
    !!decodeValue > 0
      ? decodeValue.split('~')?.map((x) => {
          const _x = {
            value: x.trim(),
            label: x.trim(),
          };
          return _x;
        })
      : [];
  const editable = useContext(EditableContext);

  if (!editable && value.length === 0) return <></>;
  return (
    <FormCell
      iconComponent={<CheckBoxIconIo color={CV_GRAY} size={'1.25rem'} />}
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
          selectedValue={selectedOptions}
          isEditable={editable}
          isFocused={isFocused}
          isMulti
          options={normalizedOptions}
          onChange={(event) => onAnyFieldChanged(elementId, event, type)}
          onBlur={() => {
            save(elementId);
            setIsFocused(false);
          }}
          className="basic-multi-select"
          classNamePrefix="select"
        />
      </OnClickAway>
    </FormCell>
  );
};
export default MultiSelectField;
