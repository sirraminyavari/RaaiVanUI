import React from 'react';
import * as Styled from './CustomSelect.styles';
import CustomSelectIndicator from './items/CustomSelectIndicator';
import DefaultSelectControl from './items/DefaultSelectControl';

const CustomSelect = React.forwardRef((props = {}, ref) => {
  const {
    options,
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

  const { classNamePrefix, components, ...otherProps } = props;

  return (
    <Styled.SelectContainer>
      <Styled.Select
        ref={ref}
        classNamePrefix="select"
        components={{
          DropdownIndicator: CustomSelectIndicator,
          Control: DefaultSelectControl,
        }}
        {...otherProps}
      />
    </Styled.SelectContainer>
  );
});

export default CustomSelect;
