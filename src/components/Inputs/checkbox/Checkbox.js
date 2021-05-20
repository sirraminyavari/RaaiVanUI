import { useState, useEffect } from 'react';
import * as Styled from './Checkbox.styles';

const Checkbox = ({ options, onSelect }) => {
  const [checks, setChecks] = useState([]);

  const handleOnChange = (e) => {
    const value = e.target.value;
    if (checks.includes(value)) {
      setChecks((oldChecks) => oldChecks.filter((c) => c !== value));
    } else {
      setChecks((oldChecks) => [...oldChecks, value]);
    }
  };

  useEffect(() => {
    onSelect(checks);
  }, [checks]);

  return (
    <Styled.CheckboxContainer onChange={handleOnChange}>
      {options.map((option) => {
        const { value, title, group } = option;
        return (
          <Styled.CheckboxOptionsWrapper>
            <input type="checkbox" id={group + '-' + value} value={value} />
            <Styled.CheckboxOptionsLabel htmlFor={group + '-' + value}>
              {title}
            </Styled.CheckboxOptionsLabel>
          </Styled.CheckboxOptionsWrapper>
        );
      })}
    </Styled.CheckboxContainer>
  );
};

export default Checkbox;
