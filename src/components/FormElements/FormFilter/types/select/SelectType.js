import { useState, useEffect } from 'react';
import * as Styled from '../types.styles';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import Checkbox from 'components/Inputs/checkbox/Checkbox';
import ExactFilter from '../../items/ExactToggle';

const SelectType = (props) => {
  const { onChange, data, value } = props;
  const { Options, AutoSuggestMode } = JSON.parse(decodeBase64(data.Info));
  const options = Options.map((option) => ({
    value: decodeBase64(option),
    title: decodeBase64(option),
    group: 'select',
  }));
  const [items, setItems] = useState(!!value ? value.TextItems : []);
  const [exact, setExact] = useState(!!value ? value.Exact : false);

  const handleOnChange = (item) => {
    if (!item.isChecked) {
      setItems((oldItems) => oldItems.filter((c) => c !== item.value));
    } else {
      setItems((oldItems) => [...oldItems, item.value]);
    }
  };

  const handleExactFilter = (exactValue) => {
    setExact(exactValue);
  };

  useEffect(() => {
    const id = data.ElementID;
    const JSONValue = {
      TextItems: items.map((item) => encodeBase64(item)),
      Exact: !items.length ? false : exact,
    };

    onChange({
      id,
      value: {
        TextItems: items,
        Exact: !items.length ? false : exact,
        JSONValue: !items.length ? null : JSONValue,
      },
    });
  }, [items, exact]);

  return (
    <Styled.SelectContainer>
      <Styled.SelectTitle>{decodeBase64(data.Title)}</Styled.SelectTitle>
      {AutoSuggestMode ? (
        <div>Radio check</div>
      ) : (
        <Checkbox
          options={options}
          onSelect={handleOnChange}
          selecteds={value?.TextItems}
        />
      )}
      <ExactFilter onToggle={handleExactFilter} isChecked={exact} />
    </Styled.SelectContainer>
  );
};

export default SelectType;
