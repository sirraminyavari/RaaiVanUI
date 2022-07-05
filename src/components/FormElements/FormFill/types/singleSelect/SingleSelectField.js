import React, { useContext, useState } from 'react';
import Select from 'react-select';
import FormCell from '../../FormCell';
import { decodeBase64 } from 'helpers/helpers';
import RadioButtonIcon from 'components/Icons/RadioButtonIcon';
import {
  CV_GRAY,
  TCV_WARM,
  CV_WHITE,
  CV_FREEZED,
  CV_DISTANT,
} from 'constant/CssVariables';
import styled from 'styled-components';
import OnClickAway from 'components/OnClickAway/OnClickAway';
import { EditableContext } from '../../FormFill';
import useWindow from 'hooks/useWindowContext';

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
  const { RVDic } = useWindow();
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
      minWidth: '7rem',
      borderColor: CV_WHITE,
      backgroundColor: CV_WHITE,
      ':focus': {
        border: 0,
      },
      ':hover': {},
    }),
    singleValue: (styles, { data }) => {
      return {
        ...styles,
        backgroundColor: '#e6f4f1',
        borderRadius: '0.5rem',
        padding: '0.3rem',
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
      iconComponent={<RadioButtonIcon color={CV_GRAY} size={'1.25rem'} />}
      title={decodeTitle}
      {...props}
    >
      <OnClickAway
        style={{}}
        onAway={() => setIsFocused(false)}
        onClick={() => {
          if (isFocused) return;
          setIsFocused(true);
        }}
      >
        {isFocused && editable ? (
          <Select
            onBlur={() => save(elementId)}
            options={normalizedOptions}
            styles={customStyles}
            isDisabled={!editable}
            value={selectedValue}
            placeholder={RVDic.Select}
            onChange={(event) => onAnyFieldChanged(elementId, event, type)}
          />
        ) : (
          <SelectedMaintainer>
            <Selected muted={!value}>{value ? value : RVDic.Select}</Selected>
          </SelectedMaintainer>
        )}
      </OnClickAway>
    </FormCell>
  );
};
export default SingleSelectField;

const Selected = styled.div`
  background-color: #e6f4f1;
  ${({ muted }) => muted && `color:${CV_DISTANT};`}
  margin-block: 0.18rem;
  margin-inline: 0.5rem;
  padding-inline: 0.5rem;
  padding-block: 0.4rem;
  border-radius: 0.5rem;
`;
const SelectedMaintainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
