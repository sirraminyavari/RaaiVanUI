import React from 'react';
import * as Styled from './CustomSelect.styles';

const CustomSelect = React.forwardRef((props, ref) => {
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
      <Styled.Select {...props} ref={ref} />
    </Styled.SelectContainer>
  );
});

export default CustomSelect;
