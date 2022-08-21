import Select from 'react-select';
import { CV_GRAY, TCV_WARM, CV_WHITE, CV_FREEZED } from 'constant/CssVariables';
import * as Styles from '../formElements.styles';
import useWindow from 'hooks/useWindowContext';
import { isArray } from 'lodash';

export interface ISelectInputField {
  selectedValue?:
    | { label: string; value: string | number }
    | { label: string; value: string | number }[];
  isEditable?: boolean;
  onChange?: (event: { label: string; value: string | number }) => void;
  onBlur?: () => void;
  options: { label: string; value: string | number }[];
  isFocused?: boolean;
  isMulti?: boolean;
  className?: string;
  classNamePrefix?: string;
}

const SelectInputField = ({
  selectedValue,
  isEditable,
  onChange,
  onBlur,
  options,
  isFocused,
  isMulti,
  classNamePrefix,
  className,
}: ISelectInputField) => {
  const { RVDic } = useWindow();

  return isFocused && isEditable ? (
    <Select
      onBlur={onBlur}
      options={options}
      styles={customStyles}
      isDisabled={!isEditable}
      value={selectedValue}
      placeholder={RVDic.Select}
      onChange={onChange}
      isMulti={isMulti}
      classNamePrefix={classNamePrefix}
      className={className}
      closeMenuOnSelect={!isMulti}
      isClearable={false}
    />
  ) : (
    <Styles.SelectedFieldItemContainer
      muted={
        isArray(selectedValue) ? !selectedValue.length : !selectedValue?.value
      }
    >
      {isMulti && isArray(selectedValue) ? (
        selectedValue.length ? (
          selectedValue.map(({ label }, idx) => {
            return (
              <Styles.SelectedFieldItem key={label + idx}>
                {label}
              </Styles.SelectedFieldItem>
            );
          })
        ) : (
          RVDic.Select
        )
      ) : (
        <Styles.SelectedFieldItem muted={selectedValue === undefined}>
          {selectedValue && !isArray(selectedValue)
            ? selectedValue.label
            : RVDic.Select}
        </Styles.SelectedFieldItem>
      )}
    </Styles.SelectedFieldItemContainer>
  );
};
SelectInputField.displayName = 'SelectInputField';

export default SelectInputField;

const customStyles = {
  option: ({ isFocused, isSelected }, provided) => ({
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
  singleValue: (styles) => {
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
  multiValue: (styles) => {
    return {
      ...styles,
      backgroundColor: '#e6f4f1',
      borderRadius: '0.5rem',
      padding: '0.3rem',
    };
  },
  multiValueRemove: (styles) => {
    return {
      ...styles,
      padding: '0.3rem',
    };
  },
};
