import { CV_GRAY } from 'constant/CssVariables';
import { decodeBase64 } from 'helpers/helpers';
import React from 'react';
import Select from 'react-select';
import FormCell from '../../FormCell';
import CheckBoxIconIo from 'components/Icons/CheckBoxIconIo';

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
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
    }),
    control: (provided) => ({
      // none of react-select's styles are passed to <Control />
      ...provided,
      minWidth: '13rem',
    }),
  };
  console.log(selectedOptions, 'selectedOptions');
  console.log(decodeValue.split('~'), 'decodeValue.split');
  console.log(!!decodeValue, 'decodeValue');
  return (
    <FormCell
      iconComponent={<CheckBoxIconIo color={CV_GRAY} />}
      title={decodeTitle}
      {...props}>
      <Select
        onBlur={() => save(elementId)}
        options={normalizedOptions}
        value={selectedOptions}
        isMulti
        styles={customStyles}
        onChange={(event) => onAnyFieldChanged(elementId, event, type)}
        className="basic-multi-select"
        classNamePrefix="select"
      />
    </FormCell>
  );
};
export default MultiSelectField;
