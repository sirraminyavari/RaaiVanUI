import Select from 'react-select';
import * as Styled from './CustomSelect.styles';

const CustomSelect = (props) => {
  const {
    defaultValue,
    value,
    isMulti,
    placeholder,
    hideSelectedOptions,
    closeMenuOnSelect,
    isClearable,
    isSearchable,
    selectName,
    selectOptions,
    onChange,
    onMenuClose,
    selectStyles,
    isLoading,
  } = props;

  return (
    <Styled.SelectContainer>
      <Select
        defaultValue={defaultValue}
        value={value}
        isMulti={isMulti}
        hideSelectedOptions={hideSelectedOptions}
        closeMenuOnSelect={closeMenuOnSelect}
        isClearable={isClearable}
        isSearchable={!!isSearchable}
        name={selectName}
        options={selectOptions}
        onChange={onChange}
        onMenuClose={onMenuClose}
        styles={selectStyles}
        placeholder={placeholder}
        isLoading={isLoading}
      />
    </Styled.SelectContainer>
  );
};

export default CustomSelect;
