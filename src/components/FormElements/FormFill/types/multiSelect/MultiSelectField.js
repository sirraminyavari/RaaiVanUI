import { CV_GRAY, CV_WHITE } from 'constant/CssVariables';
import { decodeBase64 } from 'helpers/helpers';
import React from 'react';
import Select from 'react-select';
import FormCell from '../../FormCell';
import CheckBoxIconIo from 'components/Icons/CheckBoxIconIo';
import styled from 'styled-components';

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
        ':hover': {
          color: 'red',
        },
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

  return (
    <FormCell
      iconComponent={<CheckBoxIconIo color={CV_GRAY} />}
      title={decodeTitle}
      {...props}>
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
