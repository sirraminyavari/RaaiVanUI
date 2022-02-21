import React from 'react';
import {
  CheckboxContainer,
  Input,
  CustomCheckbox,
  CheckboxLabel,
} from './RVCheckboxStyle';
import CheckIcon from '../../Icons/CheckIcons/Check';

/**
 * @description A Checkbox implemented using RaaiVan design system guide lines. Supports all of the functionality of an HTML5 checkbox, and exposes a similar API.
 * RVCheckbox can be either checked, unchecked, indeterminate, or disabled.
 * @type {React.<JSX>}
 */
const RVCheckbox = React.forwardRef((props, forwardedRef) => {
  const { children, checked, disabled, ...rest } = props;

  return (
    <CheckboxContainer disabled={disabled}>
      <Input ref={forwardedRef} disabled={disabled} {...rest} />
      <CustomCheckbox checked={checked} disabled={disabled}>
        {checked && <CheckIcon size={20} />}
      </CustomCheckbox>
      <CheckboxLabel checked={checked} disabled={disabled}>
        {children}
      </CheckboxLabel>
    </CheckboxContainer>
  );
});
RVCheckbox.displayName = 'RVCheckbox';
export default RVCheckbox;
