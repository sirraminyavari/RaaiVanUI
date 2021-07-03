import * as Styled from './Checkbox.styles';

const Checkbox = ({ options, onSelect, selecteds }) => {
  const handleOnChange = (e) => {
    const isChecked = e.target.checked;
    const value = e.target.value;
    onSelect({ value, isChecked });
  };

  return (
    <Styled.CheckboxContainer onChange={handleOnChange}>
      {options.map((option, key) => {
        const { value, title, group } = option;
        return (
          <Styled.CheckboxOptionsWrapper key={key}>
            <input
              type="checkbox"
              id={group + '-' + value}
              value={value}
              checked={selecteds?.includes(value)}
            />
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
