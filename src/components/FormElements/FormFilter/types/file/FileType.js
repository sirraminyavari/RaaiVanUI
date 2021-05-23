import { useState, useEffect } from 'react';
import * as Styled from '../types.styles';
import { encodeBase64 } from 'helpers/helpers';
import ItemProducer from 'components/ItemProducer/ItemProducer';

const FileType = (props) => {
  const { onChange, data, value } = props;
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
    <Styled.FileContainer>
      <Styled.FileTitle>{data.Title}</Styled.FileTitle>
      <ItemProducer
        isDragDisabled={true}
        onItems={handleOnItemSelect}
        style={{ width: '100%' }}
      />
    </Styled.FileContainer>
  );
};

export default FileType;
