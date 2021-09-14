import Select from 'react-select';
import * as Styled from './CustomSelect.styles';

const CustomSelect = (props) => {
  const {
    defaultValue,
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
  } = props;

  return (
    <Styled.SelectContainer>
      <Select
        defaultValue={defaultValue}
        isMulti={isMulti}
        hideSelectedOptions={hideSelectedOptions}
        closeMenuOnSelect={closeMenuOnSelect}
        isClearable={isClearable}
        isSearchable={isSearchable}
        name={selectName}
        options={selectOptions}
        onChange={onChange}
        onMenuClose={onMenuClose}
        styles={selectStyles}
        placeholder={placeholder}
      />
    </Styled.SelectContainer>
  );
};

export default CustomSelect;
