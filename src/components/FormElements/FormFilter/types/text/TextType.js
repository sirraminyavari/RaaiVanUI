import Input from '../../../../Inputs/Input';
import * as Styled from '../types.styles';
import { encodeBase64 } from 'helpers/helpers';

const TextType = (props) => {
  const { onChange, data } = props;

  const handleOnChange = (e) => {
    const text = e.target.value;
    const items = text.split(' ').map((item) => encodeBase64(item));
    const value = {
      TextItems: items,
      Exact: false,
      Or: false,
    };

    onChange({
      type: 'Text',
      value: !!text ? value : null,
    });
  };

  return (
    <Styled.TextContainer>
      <Styled.TextTitle>{data.Title}</Styled.TextTitle>
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
