import React from 'react';
import {
  CheckboxContainer,
  Input,
  CustomCheckbox,
  CheckboxLabel,
} from './RVCheckboxStyle';
import CheckIcon from '../../Icons/CheckIcons/Check';

const RVCheckbox = React.forwardRef((props, forwardedRef) => {
  const { children, checked, ...rest } = props;

  return (
    <CheckboxContainer>
      <Input ref={forwardedRef} {...rest} />
      <CustomCheckbox checked={checked}>
        {checked && <CheckIcon size={20} />}
      </CustomCheckbox>
      <CheckboxLabel checked={checked}>{children}</CheckboxLabel>
    </CheckboxContainer>
  );
});
RVCheckbox.displayName = 'RVCheckbox';
export default RVCheckbox;
