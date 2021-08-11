/**
 * Renders a file filter.
 */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Styled from '../types.styles';
import { encodeBase64, decodeBase64 } from 'helpers/helpers';
import ItemProducer from 'components/ItemProducer/ItemProducer';
import ExactFilter from 'components/FormElements/FormFilter/items/ExactToggle';
import OrFilter from 'components/FormElements/FormFilter/items/OrAndToggle';
import useWindow from 'hooks/useWindowContext';

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
  const { ElementID, Title } = data || {}; //! Meta data to feed component.

  const { GlobalUtilities } = useWindow();
  const [items, setItems] = useState(value ? value?.TextItems : []);
  const [exact, setExact] = useState(value ? value?.Exact : false);
  const [or, setOr] = useState(value ? value?.Or : true);
  const [resetValue, setResetValue] = useState(null);

  //! Fires on item select.
  const handleOnItemSelect = (items) => {
    setItems(items);
  };

  //! Fires on 'Exact' toggle change.
  const handleExactFilter = (exactValue) => {
    setExact(exactValue);
  };

  //! Fires on 'OrAnd' toggle change.
  const handleOrFilter = (orValue) => {
    setOr(orValue);
  };

  useEffect(() => {
    const id = ElementID;
    const textItems = items?.map((item) => encodeBase64(item));
    const JSONValue = {
      TextItems: textItems,
      Exact: exact,
      Or: or,
    };

    //! Send back value to parent on item change.
    onChange({
      id,
      value: {
        Type: 'file',
        TextItems: items,
        Exact: exact,
        Or: or,
        Data: items,
        JSONValue: !items?.length ? null : JSONValue,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, exact, or]);

  useEffect(() => {
    if (value === undefined) {
      setResetValue(GlobalUtilities.random());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Styled.FilterContainer>
      <Styled.FilterTitle>{decodeBase64(Title)}</Styled.FilterTitle>
      <ItemProducer
        isDragDisabled={true}
        onItems={handleOnItemSelect}
        style={{ width: '100%' }}
        resetMe={resetValue}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <OrFilter isChecked={or} onToggle={handleOrFilter} />
        <ExactFilter onToggle={handleExactFilter} isChecked={exact} />
      </div>
    </Styled.FilterContainer>
  );
};

FileType.propTypes = {
  onChange: PropTypes.func,
  data: PropTypes.object,
  value: PropTypes.object,
};

FileType.displayName = 'FilterFileComponent';

export default FileType;
