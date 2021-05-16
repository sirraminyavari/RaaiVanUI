import * as Styled from './types.styles';

const RadioType = (props) => {
  const { onChange, data } = props;

  const handleOnChange = (e) => {
    onChange({ type: 'RadioType', value: e.target.value });
  };

  return (
    <Styled.RadioContainer onChange={handleOnChange}>
      <Styled.RadioTitle>
        یکی از موارد لیست زیر را انتخاب کنید
      </Styled.RadioTitle>
      {data.options.map((option) => {
        return (
          <Styled.RadioOptionWrapper>
            <input
              id={option.value}
              type="radio"
              value={option.value}
              name={option.group}
            />
            <Styled.RadioLabel htmlFor={option.value}>
              {option.label}
            </Styled.RadioLabel>
          </Styled.RadioOptionWrapper>
        );
      })}
    </Styled.RadioContainer>
  );
};

export default RadioType;
