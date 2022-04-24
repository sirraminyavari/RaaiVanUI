import * as Styled from './Radio.styles';

const Radio = ({
  options,
  onSelect,
  selected,
  optionStyle,
  labelStyle,
  selectedStyle = '',
  disabled,
}) => {
  const handleOnChange = (e) => {
    onSelect(e.target.value);
  };

  return (
    <Styled.RadioContainer>
      {options?.map((option, key) => {
        const { value, title, group } = option;
        return (
          <Styled.RadioOptionWrapper
            selectedStyle={selected === value && selectedStyle}
            style={{ ...optionStyle }}
            key={key}
          >
            <input
              id={group + '-' + value}
              type="radio"
              value={value}
              name={group}
              onChange={handleOnChange}
              checked={!disabled ? selected === value : !disabled}
              disabled={disabled}
            />
            <Styled.RadioLabel
              style={{ ...labelStyle }}
              htmlFor={group + '-' + value}
            >
              {title}
            </Styled.RadioLabel>
          </Styled.RadioOptionWrapper>
        );
      })}
    </Styled.RadioContainer>
  );
};

export default Radio;
