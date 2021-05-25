import { useState, useEffect } from 'react';
import * as Styled from '../types.styles';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import Checkbox from 'components/Inputs/checkbox/Checkbox';

const SelectType = (props) => {
  const { onChange, data, value } = props;
  const { Options, AutoSuggestMode } = JSON.parse(decodeBase64(data.Info));
  const [items, setItems] = useState([]);

  const handleOnChange = (item) => {
    if (!item.isChecked) {
      setItems((oldItems) => oldItems.filter((c) => c !== item.value));
    } else {
      setItems((oldItems) => [...oldItems, item.value]);
    }
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

  useEffect(() => {
    if (value === undefined) {
      setItems([]);
    }
  }, [value]);

  return (
    <Styled.SelectContainer>
      <Styled.SelectTitle>{data.Title}</Styled.SelectTitle>
      {AutoSuggestMode ? (
        <div>Radio check</div>
      ) : (
        <Checkbox
          options={Options}
          onSelect={handleOnChange}
          selecteds={value?.TextItems}
        />
      )}
    </Styled.SelectContainer>
  );
};

export default SelectType;
