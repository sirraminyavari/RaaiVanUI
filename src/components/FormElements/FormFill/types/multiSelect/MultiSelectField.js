import { CV_FREEZED, CV_GRAY, CV_WHITE, TCV_WARM } from 'constant/CssVariables';
import { decodeBase64 } from 'helpers/helpers';
import React, { useContext, useState } from 'react';
import Select from 'react-select';
import FormCell from '../../FormCell';
import CheckBoxIconIo from 'components/Icons/CheckBoxIconIo';
import OnClickAway from 'components/OnClickAway/OnClickAway';
import { EditableContext } from '../../FormFill';
import * as Styles from '../formField.styles';
import useWindow from 'hooks/useWindowContext';

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
  const { RVDic } = useWindow();
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
      <OnClickAway
        style={{}}
        onClick={() => {
          if (isFocused) return;
          setIsFocused(true);
        }}
      >
        {isFocused && editable ? (
          <Select
            onBlur={() => {
              save(elementId);
              setIsFocused(false);
            }}
            options={normalizedOptions}
            value={selectedOptions}
            isMulti
            isClearable={false}
            isDisabled={!editable}
            closeMenuOnSelect={false}
            styles={customStyles}
            onChange={(event) => onAnyFieldChanged(elementId, event, type)}
            className="basic-multi-select"
            classNamePrefix="select"
          />
        ) : (
          <Styles.SelectedFieldItemContainer muted={!selectedOptions.length}>
            {selectedOptions.length
              ? selectedOptions.map(({ label }, idx) => {
                  return (
                    <Styles.SelectedFieldItem key={label + idx}>
                      {label}
                    </Styles.SelectedFieldItem>
                  );
                })
              : RVDic.Select}
          </Styles.SelectedFieldItemContainer>
        )}
      </OnClickAway>
    </FormCell>
  );
};
export default MultiSelectField;
