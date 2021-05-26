import { useCallback, useEffect, useState, useContext } from 'react';
import * as Styled from '../types.styles';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import Checkbox from 'components/Inputs/checkbox/Checkbox';
import ExactFilter from '../../items/ExactToggle';
import OrFilter from '../../items/OrAndSelect';
import { WindowContext } from 'context/WindowProvider';

const CheckboxType = (props) => {
  const { onChange, data, value } = props;

  const { RVDic } = useContext(WindowContext);
  const { Options, AutoSuggestMode } = JSON.parse(decodeBase64(data.Info));
  const options = Options.map((option) => ({
    value: decodeBase64(option),
    title: decodeBase64(option),
    group: 'select',
  }));
  const [items, setItems] = useState([]);
  const [exact, setExact] = useState(false);
  const [or, setOr] = useState(true);

  const orOptions = [
    { value: 'or', title: RVDic.Or },
    { value: 'and', title: RVDic.And },
  ];

  const handleOnItemSelect = useCallback((item) => {
    if (!item.isChecked) {
      setItems((oldItems) => oldItems.filter((c) => c !== item.value));
    } else {
      setItems((oldItems) => [...oldItems, item.value]);
    }
  }, []);

  const handleExactFilter = (exactValue) => {
    setExact(exactValue);
  };

  const handleOrFilter = (orValue) => {
    if (orValue === 'or') {
      setOr(true);
    } else {
      setOr(false);
    }
  };

  useEffect(() => {
    const id = data.ElementID;
    const textItems = items.map((item) => encodeBase64(item));
    const JSONValue = {
      TextItems: textItems,
      Exact: exact,
      Or: or,
    };

    onChange({
      id,
      value: {
        TextItems: items,
        Exact: exact,
        Or: or,
        JSONValue: !items.length ? null : JSONValue,
      },
    });
  }, [items, exact, or]);

  useEffect(() => {
    if (value === undefined) {
      setItems([]);
    }
  }, [value]);

  return (
    <Styled.CheckboxContainer>
      <Styled.CheckboxTitle>{decodeBase64(data.Title)}</Styled.CheckboxTitle>
      {AutoSuggestMode ? (
        <Checkbox
          options={options}
          onSelect={handleOnItemSelect}
          selecteds={value?.TextItems}
        />
      ) : (
        <Checkbox
          options={Options}
          onSelect={handleOnItemSelect}
          selecteds={value?.TextItems}
        />
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <OrFilter
          options={orOptions}
          selectedOption={!!or ? 0 : 1}
          name="checkbox-or-filter"
          onSelect={handleOrFilter}
        />
        <ExactFilter onToggle={handleExactFilter} isChecked={exact} />
      </div>
    </Styled.CheckboxContainer>
  );
};

export default CheckboxType;
