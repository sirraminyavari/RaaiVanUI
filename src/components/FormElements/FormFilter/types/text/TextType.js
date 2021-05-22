import * as Styled from '../types.styles';
import { encodeBase64 } from 'helpers/helpers';
import ItemProducer from 'components/ItemProducer/ItemProducer';

const TextType = (props) => {
  const { onChange, data } = props;

  const handleOnItemSelect = (items) => {
    const textItems = items.map((item) => encodeBase64(item));
    const value = {
      TextItems: textItems,
      Exact: false,
      Or: false,
    };

    onChange({
      type: 'Text',
      value: textItems.length ? value : null,
    });
  };

  return (
    <Styled.TextContainer>
      <Styled.TextTitle>{data.Title}</Styled.TextTitle>
      <ItemProducer
        isDragDisabled={true}
        onItems={handleOnItemSelect}
        style={{ width: '100%' }}
      />
    </Styled.TextContainer>
  );
};

export default TextType;
