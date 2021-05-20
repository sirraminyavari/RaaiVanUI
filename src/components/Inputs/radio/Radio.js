import * as Styled from './Radio.styles';

const Radio = ({ options, onSelect }) => {
  const handleOnChange = (e) => {
    onSelect(e.target.value);
  };

  return (
    <Styled.RadioContainer onChange={handleOnChange}>
      {options.map((option) => {
        const { value, title, group } = option;
        return (
          <Styled.RadioOptionWrapper>
            <input
              id={group + '-' + value}
              type="radio"
              value={value}
              name={group}
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
