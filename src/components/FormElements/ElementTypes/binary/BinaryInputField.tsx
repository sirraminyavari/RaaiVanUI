import { ReactNode } from 'react';
import * as Styles from './BinaryInputField.styles';

export interface IBinaryInputField {
  isFocused: boolean;
  isEditable: boolean;
  onChange: ({ label: string, value: boolean }) => void;
  yesLabel: ReactNode;
  noLabel: ReactNode;
  value: boolean;
}

const BinaryInputField = ({
  isFocused,
  isEditable,
  onChange,
  yesLabel,
  noLabel,
  value,
}: IBinaryInputField) => {
  return (
    <Styles.BinaryInputFieldContainer>
      <Styles.BinaryInputFieldItem
        onClick={() =>
          isFocused &&
          isEditable &&
          onChange &&
          onChange({ label: yesLabel, value: true })
        }
        isFocused={isFocused}
        isSelected={value === true}
      >
        {yesLabel}
      </Styles.BinaryInputFieldItem>
      <Styles.BinaryInputFieldDivider
        isFocused={isFocused}
        isSelected={value !== null}
      />
      <Styles.BinaryInputFieldItem
        isFocused={isFocused}
        isSelected={value === false}
        onClick={() =>
          isFocused &&
          isEditable &&
          onChange &&
          onChange({ label: noLabel, value: false })
        }
      >
        {noLabel}
      </Styles.BinaryInputFieldItem>
    </Styles.BinaryInputFieldContainer>
  );
};

export default BinaryInputField;
