import React from 'react';
import {
  CheckboxContainer,
  Input,
  CustomCheckbox,
  CheckboxLabel,
} from './CheckboxStyle';
import CheckIcon from '../../Icons/CheckIcons/Check';

const RVCheckbox = React.forwardRef((props, ref) => {
  const { children, checked, ...rest } = props;

  return (
    <CheckboxContainer>
      <Input {...{ checked, ref }} {...rest} />
      <CustomCheckbox checked={checked}>
        {checked && <CheckIcon size={20} />}
      </CustomCheckbox>
      <CheckboxLabel checked={checked}>{children}</CheckboxLabel>
    </CheckboxContainer>
  );
});
RVCheckbox.displayName = 'RVCheckbox';
export default RVCheckbox;
