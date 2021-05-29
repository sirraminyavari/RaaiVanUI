/**
 * Renders a file filter.
 */
import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import * as Styled from '../types.styles';
import { encodeBase64, decodeBase64 } from 'helpers/helpers';
import ItemProducer from 'components/ItemProducer/ItemProducer';
import ExactFilter from '../../items/ExactToggle';
import OrFilter from '../../items/OrAndSelect';
import { WindowContext } from 'context/WindowProvider';

/**
 * @typedef PropType
 * @type {Object}
 * @property {Object} value - Value of component.
 * @property {Object} data - Meta data needed for component.
 * @property {function} onChange - A callback function that fires when value changes.
 */

/**
 *  @description Renders a file type component.
 * @component
 * @param {PropType} props -Props that are passed to component.
 */
const FileType = (props) => {
  const { onChange, data, value } = props;
  const { ElementID, Title } = data; //! Meta data to feed component.

  const { RVDic } = useContext(WindowContext);
  const [items, setItems] = useState(value ? value.TextItems : []);
  const [exact, setExact] = useState(value ? value.Exact : false);
  const [or, setOr] = useState(value ? value.Or : true);

  //! Options for 'OrAnd' select;
  const orOptions = [
    { value: 'or', title: RVDic.Or },
    { value: 'and', title: RVDic.And },
  ];

  //! Fires on item select.
  const handleOnItemSelect = (items) => {
    setItems(items);
  };

  //! Fires on 'Exact' toggle change.
  const handleExactFilter = (exactValue) => {
    setExact(exactValue);
  };

  //! Fires on 'OrAnd' change.
  const handleOrFilter = (orValue) => {
    if (orValue === 'or') {
      setOr(true);
    } else {
      setOr(false);
    }
  };

  useEffect(() => {
    const id = ElementID;
    const textItems = items.map((item) => encodeBase64(item));
    const JSONValue = {
      TextItems: textItems,
      Exact: exact,
      Or: or,
    };

    //! Send back value to parent on item change.
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
  }, [items, exact, or]);

  return (
    <Styled.FileContainer>
      <Styled.FileTitle>{decodeBase64(Title)}</Styled.FileTitle>
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
          name="file-or-filter"
          onSelect={handleOrFilter}
        />
        <ExactFilter onToggle={handleExactFilter} isChecked={exact} />
      </div>
    </Styled.FileContainer>
  );
};

FileType.propTypes = {
  onChange: PropTypes.func,
  data: PropTypes.object,
  value: PropTypes.object,
};

FileType.displayName = 'FilterFileComponent';

export default FileType;
