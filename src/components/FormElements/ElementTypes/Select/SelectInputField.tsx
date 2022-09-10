import Select from 'react-select';
import { CV_GRAY, TCV_WARM, CV_WHITE, CV_FREEZED } from 'constant/CssVariables';
import * as Styles from '../formElements.styles';
import useWindow from 'hooks/useWindowContext';
import { isArray } from 'lodash';

type OptionType = { label: string; value: string | number };
export interface ISelectInputField {
  selectedValue?: OptionType | OptionType[];
  isEditable?: boolean;
  onChange?: (
    event: OptionType,
    actionMeta: {
      action?: string;
      option?: OptionType | undefined;
      name?: string | undefined;
    }
  ) => void;
  onBlur?: () => void;
  options: OptionType[];
  isFocused?: boolean;
  isMulti?: boolean;
  isSearchable?: boolean;
  className?: string;
  classNamePrefix?: string;
}

const SelectInputField = ({
  selectedValue,
  isEditable,
  onChange = () => {},
  onBlur,
  options,
  isFocused,
  isMulti,
  isSearchable,
  classNamePrefix,
  className,
}: ISelectInputField) => {
  const { RVDic } = useWindow();

  return isFocused && isEditable ? (
    <Select
      onBlur={onBlur}
      options={options}
      isDisabled={!isEditable}
      value={selectedValue}
      placeholder={RVDic.Select}
      isMulti={isMulti}
      classNamePrefix={classNamePrefix}
      className={className}
      closeMenuOnSelect={!isMulti}
      isClearable={false}
      isSearchable={isSearchable}
      styles={customStyles}
      onChange={onChange}
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
          <Styles.SelectedFieldItem muted>
            {RVDic.Select}
          </Styles.SelectedFieldItem>
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
    minWidth: '9rem',
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
      // backgroundColor: '#e6f4f1',
      borderRadius: '0.5rem',
      padding: '0.3rem',
      minWidth: '9rem',
    };
  },
  menu: (provided) => ({
    ...provided,
    borderColor: '#e6f4f1',
    minWidth: '9rem',

    ':hover': {
      borderWidth: 0,
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    borderColor: '#e6f4f1',
    minWidth: '9rem',
    padding: '0.3rem',

    ':hover': {
      borderWidth: 0,
    },
  }),
  multiValueRemove: (styles) => {
    return {
      ...styles,
      padding: '0.3rem',
    };
  },
};
