import React from 'react';
import Select from 'react-select';
import FormCell from '../../FormCell';
import { decodeBase64 } from 'helpers/helpers';
import RadioButtonIcon from 'components/Icons/RadioButtonIcon';
import {
  CV_DISTANT,
  CV_GRAY,
  TCV_DEFAULT,
  TCV_VERYWARM,
  TCV_WARM,
} from 'constant/CssVariables';
import styled from 'styled-components';

const { RVDic } = window;
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
  const customStyles = {
    option: (
      styles,
      { data, isDisabled, isFocused, isSelected },
      provided,
      state
    ) => ({
      ...provided,
      color: isSelected ? TCV_WARM : CV_GRAY,
      margin: '0.35rem 0.5rem 0.35rem 0.5rem',
    }),
    control: (provided) => ({
      // none of react-select's styles are passed to <Control />
      ...provided,
      width: '7rem',
    }),
  };
  console.log(decodeValue, '########', value, normalizedOptions);
  return (
    <FormCell
      iconComponent={<RadioButtonIcon color={CV_GRAY} />}
      title={decodeTitle}
      {...props}>
      {value ? (
        <Selected
          className={'rv-border-radius-half'}
          onClick={() =>
            onAnyFieldChanged(elementId, { value: null, label: null }, type)
          }>
          {selectedValue?.label}
        </Selected>
      ) : (
        <Select
          onBlur={() => save(elementId)}
          options={normalizedOptions}
          styles={customStyles}
          value={selectedValue}
          placeholder={RVDic.Select}
          onChange={(event) => onAnyFieldChanged(elementId, event, type)}
        />
      )}
    </FormCell>
  );
};
export default SingleSelectField;

const Selected = styled.div`
  background-color: #e6f4f1;
  padding: 0.5rem;
`;
