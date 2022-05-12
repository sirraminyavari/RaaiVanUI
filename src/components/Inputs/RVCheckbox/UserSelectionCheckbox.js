import React, { createContext, useContext } from 'react';
import {
  CheckboxContainer,
  CheckboxLabel,
  Image,
  Input,
  LabelContainer,
} from './CheckboxStyle';

const CheckboxContext = createContext({});
const UserSelectionCheckbox = React.forwardRef((props, ref) => {
  const { children, checked, disabled, ...rest } = props;

  return (
    <CheckboxContainer>
      <Input {...{ checked, disabled, ref }} {...rest} />
      <CheckboxContext.Provider value={{ checked, disabled }}>
        {children}
      </CheckboxContext.Provider>
    </CheckboxContainer>
  );
});
const Label = ({ src, title }) => {
  const { checked, disabled } = useContext(CheckboxContext);
  return (
    <LabelContainer>
      <Image {...{ src, checked, disabled }}></Image>
      <CheckboxLabel {...{ checked, disabled }}>{title}</CheckboxLabel>
    </LabelContainer>
  );
};
UserSelectionCheckbox.Label = Label;
UserSelectionCheckbox.displayName = 'UserSelectionCheckbox';
export default UserSelectionCheckbox;
