import { useEffect, useState } from 'react';
import * as Styled from '../types.styles';
import { encodeBase64, decodeBase64 } from 'helpers/helpers';
import ItemProducer from 'components/ItemProducer/ItemProducer';

const TextType = (props) => {
  const { onChange, data } = props;
  const [items, setItems] = useState([]);

  const handleOnItemSelect = (items) => {
    setItems(items);
  };

  useEffect(() => {
    const id = data.ElementID;
    const textItems = items.map((item) => encodeBase64(item));
    const JSONValue = {
      TextItems: textItems,
      Exact: false,
      Or: false,
    };

    onChange({
      id,
      value: {
        TextItems: items,
        Exact: false,
        Or: false,
        Data: items,
        JSONValue: !items.length ? null : JSONValue,
      },
    });
  }, [items]);

  return (
    <Styled.TextContainer>
      <Styled.TextTitle>{decodeBase64(data.Title)}</Styled.TextTitle>
      <ItemProducer
        isDragDisabled={true}
        onItems={handleOnItemSelect}
        style={{ width: '100%' }}
      />
    </Styled.TextContainer>
  );
};

export default TextType;
