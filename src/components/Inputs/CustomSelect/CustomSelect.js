import React from 'react';
import * as Styled from './CustomSelect.styles';
import CustomSelectIndicator from './items/CustomSelectIndicator';
import DefaultSelectControl from './items/DefaultSelectControl';

const CustomSelect = React.forwardRef((props = {}, ref) => {
  const { classNamePrefix, components, ...rest } = props;

  return (
    <Styled.SelectContainer>
      <Styled.Select
        ref={ref}
        classNamePrefix="select"
        components={{
          DropdownIndicator: CustomSelectIndicator,
          Control: DefaultSelectControl,
          ...components,
        }}
        {...rest}
      />
    </Styled.SelectContainer>
  );
});
CustomSelect.displayName = 'CustomSelect';
export default CustomSelect;
