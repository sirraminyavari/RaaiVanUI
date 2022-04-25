import { CV_FREEZED, CV_GRAY, CV_WHITE, TCV_WARM } from 'constant/CssVariables';
import { decodeBase64 } from 'helpers/helpers';
import React, { useContext } from 'react';
import Select from 'react-select';
import FormCell from '../../FormCell';
import CheckBoxIconIo from 'components/Icons/CheckBoxIconIo';
import styled from 'styled-components';
import { EditableContext } from '../../FormFill';

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
    option: (
      styles,
      { data, isDisabled, isFocused, isSelected },
      provided,
      state
    ) => ({
      ...provided,
      color: isSelected ? TCV_WARM : CV_GRAY,
      margin: '0.35rem 0.5rem 0.35rem 0.5rem',
      padding: '0.2rem 0.2rem 0.2rem 0.2rem',
      backgroundColor: isFocused && CV_FREEZED,
      ':hover': {
        color: TCV_WARM,
        backgroundColor: CV_FREEZED,
        padding: '0.2rem 0.2rem 0.2rem 0.2rem',
      },
    }),
    control: (provided) => ({
      // none of react-select's styles are passed to <Control />
      ...provided,
      minWidth: '13rem',
      borderColor: CV_WHITE,
      backgroundColor: CV_WHITE,
      ':focus': {
        borderWidth: 0,
      },
      ':hover': {},
    }),
    multiValue: (styles, { data }) => {
      return {
        ...styles,
        backgroundColor: '#e6f4f1',
        borderRadius: '0.5rem',
        padding: '0.3rem',
      };
    },
    multiValueRemove: (styles, { data }) => {
      return {
        ...styles,
      };
    },
    menu: (provided) => ({
      ...provided,
      borderColor: '#e6f4f1',
      ':hover': {
        borderWidth: 0,
      },
    }),
  };
  const editable = useContext(EditableContext);

  return (
    <FormCell
      iconComponent={<CheckBoxIconIo color={CV_GRAY} size={'1.25rem'} />}
      title={decodeTitle}
      {...props}
    >
      {/* {value && selectedOptions?.length > 0 ? (
        <SelectedMaintainer>
          {selectedOptions?.map((x) => (
            <Selected
              className={'rv-border-radius-half'}
              onClick={() => onAnyFieldChanged(elementId, [], type)}>
              {x?.label}
            </Selected>
          ))}
        </SelectedMaintainer>
      ) : ( */}
      <Select
        onBlur={() => save(elementId)}
        options={normalizedOptions}
        value={selectedOptions}
        isMulti
        isClearable={false}
        isDisabled={!editable}
        styles={customStyles}
        onChange={(event) => onAnyFieldChanged(elementId, event, type)}
        className="basic-multi-select"
        classNamePrefix="select"
      />
      {/* )} */}
    </FormCell>
  );
};
export default MultiSelectField;
const Selected = styled.div`
  background-color: #e6f4f1;
  padding: 0.5rem;
`;
const SelectedMaintainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
