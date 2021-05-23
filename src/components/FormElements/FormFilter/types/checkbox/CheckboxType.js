import { useCallback, useEffect, useState } from 'react';
import * as Styled from '../types.styles';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import Checkbox from 'components/Inputs/checkbox/Checkbox';

const CheckboxType = (props) => {
  const { onChange, data } = props;

  const { Options, AutoSuggestMode } = JSON.parse(decodeBase64(data.Info));
  const [items, setItems] = useState([]);

  const handleOnItemSelect = useCallback((items) => {
    setItems(items);
  }, []);

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
        JSONValue: !items.length ? null : JSONValue,
      },
    });
  }, [items]);

  return (
    <Styled.CheckboxContainer>
      <Styled.CheckboxTitle>{data.Title}</Styled.CheckboxTitle>
      {AutoSuggestMode ? (
        <div>Checkbox</div>
      ) : (
        <Checkbox options={Options} onSelect={handleOnItemSelect} />
      )}
    </Styled.CheckboxContainer>
  );
};

export default CheckboxType;
