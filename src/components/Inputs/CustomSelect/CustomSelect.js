import React from 'react';
import * as Styled from './CustomSelect.styles';
import CustomSelectIndicator from './items/CustomSelectIndicator';

const CustomSelect = React.forwardRef(
  ({ classNamePrefix, components, ...props }, ref) => {
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
        <Styled.Select
          classNamePrefix="select"
          components={{
            ...components,
            DropdownIndicator: CustomSelectIndicator,
          }}
          {...props}
          ref={ref}
        />
      </Styled.SelectContainer>
    );
  }
);

export default CustomSelect;
