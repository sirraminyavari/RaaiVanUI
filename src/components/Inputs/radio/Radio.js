import * as Styled from './Radio.styles';

const Radio = ({ options, onSelect, selected }) => {
  const handleOnChange = (e) => {
    onSelect(e.target.value);
  };

  return (
    <Styled.RadioContainer>
      {options.map((option, key) => {
        const { value, title, group } = option;
        return (
          <Styled.RadioOptionWrapper key={key}>
            <input
              id={group + '-' + value}
              type="radio"
              value={value}
              name={group}
              onChange={handleOnChange}
              checked={selected === value}
            />
            <Styled.RadioLabel htmlFor={group + '-' + value}>
              {title}
            </Styled.RadioLabel>
          </Styled.RadioOptionWrapper>
        );
      })}
    </Styled.RadioContainer>
  );
};

export default Radio;
