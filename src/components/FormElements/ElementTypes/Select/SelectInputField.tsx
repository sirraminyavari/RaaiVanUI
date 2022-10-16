import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import {
  CV_GRAY,
  TCV_WARM,
  CV_WHITE,
  CV_FREEZED,
  TCV_VERY_TRANSPARENT,
  CV_RED,
} from 'constant/CssVariables';
import * as Styles from '../formElements.styles';
import useWindow from 'hooks/useWindowContext';
import { isArray } from 'lodash';

type OptionType = { label: string; value: string | number };
export interface ISelectInputField {
  selectedValue?: OptionType | OptionType[];
  isEditable?: boolean;
  isCreatable?: boolean;
  onChange?: (
    event: OptionType | OptionType[],
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
  isClearable?: boolean;
  className?: string;
  classNamePrefix?: string;
  components?: any;
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
  isClearable = false,
  components,
  isCreatable = false,
}: ISelectInputField) => {
  const { RVDic } = useWindow();
  const SelectComponent = isCreatable ? CreatableSelect : Select;

  // return isFocused && isEditable ? (
  return isFocused && isEditable ? (
    <SelectComponent
      onBlur={onBlur}
      options={options}
      isDisabled={!isEditable}
      value={selectedValue}
      placeholder={RVDic.Select}
      isMulti={isMulti}
      classNamePrefix={classNamePrefix}
      className={className}
      closeMenuOnSelect={!isMulti}
      isClearable={isClearable}
      isSearchable={isSearchable}
      styles={customStyles}
      onChange={onChange}
      components={{
        ...components,
        ClearIndicator: () => <Styles.SelectInputClearButton />,
        CrossIcon: () => <Styles.SelectInputRemoveButton />,
      }}
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
              <Styles.SelectedFieldItem selectInput key={label + idx}>
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
        <Styles.SelectedFieldItem
          selectInput={selectedValue !== undefined}
          muted={selectedValue === undefined}
        >
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
    borderRadius: '0.5rem',
    // ':focus': {
    //   border: 0,
    // },
  }),
  input: (provided) => ({
    ...provided,
    minWidth: '4rem',
    cursor: 'text',
  }),
  menu: (provided) => ({
    ...provided,
    borderColor: TCV_VERY_TRANSPARENT,
    minWidth: '9rem',
    zIndex: 5,

    ':hover': {
      borderWidth: 0,
    },
  }),
  singleValue: (styles) => {
    return {
      ...styles,
      backgroundColor: TCV_VERY_TRANSPARENT,
      padding: '0.3rem',
      minWidth: 'initial',
      justifyContent: 'space-between',
      marginBlock: '0',
      marginInline: '0.5rem',
      paddingInline: '0.5rem',
      paddingBlock: '0.2rem',
      borderRadius: '0.5rem',
      fontSize: '0.93rem',
    };
  },
  multiValue: (provided) => ({
    ...provided,
    borderColor: TCV_VERY_TRANSPARENT,
    backgroundColor: TCV_VERY_TRANSPARENT,
    minWidth: 'initial',
    padding: '0.3rem',
    display: 'flex',
    justifyContent: 'space-between',
    marginBlock: '0.18rem',
    marginInline: '0.5rem',
    paddingInline: '0.5rem',
    paddingBlock: '0.4rem',
    borderRadius: '0.5rem',
    fontSize: '0.93rem',

    ':hover': {
      borderWidth: 0,
    },
  }),
  valueContainer: (styles) => {
    return {
      ...styles,
    };
  },
  multiValueLabel: (styles) => {
    return {
      ...styles,
      paddingInlineEnd: '0.6125rem',
      fontSize: '.8125rem',
    };
  },
  singleValueLabel: (styles) => {
    return {
      ...styles,
      fontSize: '.8125rem',
    };
  },
  placeholder: (styles) => {
    return {
      ...styles,
      fontSize: '0.8125rem',
    };
  },
  multiValueRemove: (styles) => {
    return {
      ...styles,
      margin: '0.3rem',
      padding: '0.1rem',
      color: CV_RED,
      transform: 'scale(1.5)',
      ':hover': {
        ...styles[':hover'],
        backgroundColor: 'transparent',
        cursor: 'pointer',
      },
    };
  },
};
