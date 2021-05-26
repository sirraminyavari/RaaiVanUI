import { useState, useEffect, useContext } from 'react';
import * as Styled from '../types.styles';
import { encodeBase64, decodeBase64 } from 'helpers/helpers';
import ItemProducer from 'components/ItemProducer/ItemProducer';
import ExactFilter from '../../items/ExactToggle';
import OrFilter from '../../items/OrAndSelect';
import { WindowContext } from 'context/WindowProvider';

const FileType = (props) => {
  const { onChange, data, value } = props;
  const { RVDic } = useContext(WindowContext);

  const [items, setItems] = useState([]);
  const [exact, setExact] = useState(false);
  const [or, setOr] = useState(true);

  const orOptions = [
    { value: 'or', title: RVDic.Or },
    { value: 'and', title: RVDic.And },
  ];

  const handleOnItemSelect = (items) => {
    setItems(items);
  };

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
        Data: items,
        JSONValue: !items.length ? null : JSONValue,
      },
    });
  }, [items]);

  return (
    <Styled.FileContainer>
      <Styled.FileTitle>{decodeBase64(data.Title)}</Styled.FileTitle>
      <ItemProducer
        isDragDisabled={true}
        onItems={handleOnItemSelect}
        style={{ width: '100%' }}
      />
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
    </Styled.FileContainer>
  );
};

export default FileType;
