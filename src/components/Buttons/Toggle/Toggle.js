import { useState, useEffect } from 'react';
import * as Styled from './Toggle.styles';

const Toggle = (props) => {
  const { onToggle, ...rest } = props;
  const [isChecked, setIsChecked] = useState(false);

  const toggle = () => {
    setIsChecked((c) => !c);
  };

  useEffect(() => {
    onToggle && onToggle(isChecked);
  }, [isChecked]);

  return (
    <Styled.ToggleLabel>
      <Styled.ToggleInput
        type="checkbox"
        checked={isChecked}
        onClick={toggle}
      />
      <Styled.ToggleButton isChecked={isChecked} {...rest} />
    </Styled.ToggleLabel>
  );
};

export default Toggle;
