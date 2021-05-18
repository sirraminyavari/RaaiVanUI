import * as Styled from '../types.styles';

const Radio = ({ options }) => {
  return options.map((option) => {
    return (
      <Styled.SelectOptionWrapper>
        <input
          id={option.value}
          type="radio"
          value={option.value}
          name={option.group}
        />
        <Styled.SelectLabel htmlFor={option.value}>
          {option.title}
        </Styled.SelectLabel>
      </Styled.SelectOptionWrapper>
    );
  });
};

export default Radio;
