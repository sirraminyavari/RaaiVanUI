import * as Styled from './Checkbox.styles';

const Checkbox = (props) => {
  const { isChecked, changeHandler } = props;
  return (
    <Styled.CheckboxContainer>
      <label>Eng:</label>
      <input
        type="checkbox"
        defaultChecked={isChecked}
        onChange={changeHandler}
      />
    </Styled.CheckboxContainer>
  );
};

export default Checkbox;
