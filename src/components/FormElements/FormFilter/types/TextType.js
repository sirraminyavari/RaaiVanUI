import Input from '../../../Inputs/Input';
import * as Styled from './types.styles';

const TextType = (props) => {
  const { onChange, data } = props;
  console.log(data);

  const handleOnChange = (e) => {
    onChange({ type: 'TextType', value: e.target.value });
  };

  return (
    <Styled.TextContainer>
      <Styled.TextTitle>فیلتر نمونه متنی</Styled.TextTitle>
      <div>
        <Input
          style={{ width: '100%' }}
          onChange={handleOnChange}
          placeholder="متن مورد نظر خود را بنویسید"
        />
      </div>
    </Styled.TextContainer>
  );
};

export default TextType;
