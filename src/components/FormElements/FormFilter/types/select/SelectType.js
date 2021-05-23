import { useState, useEffect } from 'react';
import * as Styled from '../types.styles';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import Checkbox from 'components/Inputs/checkbox/Checkbox';

const SelectType = (props) => {
  const { onChange, data } = props;
  const { Options, AutoSuggestMode } = JSON.parse(decodeBase64(data.Info));
  const [items, setItems] = useState([]);

  const handleOnChange = (items) => {
    setItems(items);
  };

  useEffect(() => {
    const id = data.ElementID;
    const JSONValue = {
      TextItems: items.map((item) => encodeBase64(item)),
      Exact: false,
    };

    onChange({
      id,
      value: {
        TextItems: items,
        Exact: false,
        JSONValue: !items.length ? null : JSONValue,
      },
    });
  }, [items]);

  return (
    <Styled.SelectContainer>
      <Styled.SelectTitle>{data.Title}</Styled.SelectTitle>
      {AutoSuggestMode ? (
        <div>Radio check</div>
      ) : (
        <Checkbox options={Options} onSelect={handleOnChange} />
      )}
    </Styled.SelectContainer>
  );
};

export default SelectType;
