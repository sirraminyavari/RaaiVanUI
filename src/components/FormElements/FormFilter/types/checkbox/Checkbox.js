import { encodeBase64 } from 'helpers/helpers';
import { useState, useEffect } from 'react';
import * as Styled from '../types.styles';

const Checkbox = ({ options, onSelect }) => {
  const [checks, setChecks] = useState([]);

  const handleOnClick = (e) => {
    const value = e.target.value;
    if (checks.includes(value)) {
      setChecks((oldChecks) => oldChecks.filter((c) => c !== value));
    } else {
      setChecks((oldChecks) => [...oldChecks, value]);
    }
  };

  useEffect(() => {
    onSelect(checks.map((check) => encodeBase64(check)));
  }, [checks]);

  return (
    <div onChange={handleOnClick}>
      {options.map((option) => {
        return (
          <Styled.CheckboxOptionsWrapper>
            <input
              type="checkbox"
              id={option.value}
              name={option.value}
              value={option.value}
            />
            <Styled.CheckboxOptionsLabel for={option.value}>
              {option.title}
            </Styled.CheckboxOptionsLabel>
          </Styled.CheckboxOptionsWrapper>
        );
      })}
    </div>
  );
};

export default Checkbox;
