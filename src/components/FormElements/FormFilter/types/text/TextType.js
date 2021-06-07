/**
 * Renders a text filter.
 */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as Styled from '../types.styles';
import { encodeBase64, decodeBase64 } from 'helpers/helpers';
import ItemProducer from 'components/ItemProducer/ItemProducer';
import ExactFilter from '../../items/ExactToggle';
import OrFilter from '../../items/OrAndSelect';
import useWindow from 'hooks/useWindowContext';

/**
 * @typedef PropType
 * @type {Object}
 * @property {Object} value - Value of component.
 * @property {Object} data - Meta data needed for component.
 * @property {function} onChange - A callback function that fires when value changes.
 */

/**
 *  @description Renders a text type component.
 * @component
 * @param {PropType} props -Props that are passed to component.
 */
const TextType = (props) => {
  const { onChange, data, value } = props;
  const { ElementID, Title, Info } = data; //! Meta data to feed component.

  const [items, setItems] = useState(!!value ? value.TextItems : []);
  const [exact, setExact] = useState(!!value ? value.Exact : false);
  const [resetValue, setResetValue] = useState(null);
  const [or, setOr] = useState(!!value ? value.Or : true);
  const { RVDic, GlobalUtilities } = useWindow();

  //! Options for 'OrAnd' select;
  const orOptions = [
    { value: 'or', title: RVDic.Or },
    { value: 'and', title: RVDic.And },
  ];

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

    //! Send back value to parent on add text.
    onChange({
      id,
      value: {
        Type: 'text',
        TextItems: items,
        Exact: exact,
        Or: or,
        Data: items,
        JSONValue: !items.length ? null : JSONValue,
      },
    });
  }, [items, exact, or]);

  useEffect(() => {
    if (value === undefined) {
      setResetValue(GlobalUtilities.random());
    }
  }, [value]);

  return (
    <Styled.TextContainer>
      <Styled.TextTitle>{decodeBase64(Title)}</Styled.TextTitle>
      <ItemProducer
        isDragDisabled={true}
        onItems={handleOnItemSelect}
        style={{ width: '100%' }}
        savedData={items}
        resetMe={resetValue}
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
          name="text-or-filter"
          onSelect={handleOrFilter}
        />
        <ExactFilter onToggle={handleExactFilter} isChecked={exact} />
      </div>
    </Styled.TextContainer>
  );
};

TextType.propTypes = {
  onChange: PropTypes.func,
  data: PropTypes.object,
  value: PropTypes.object,
};

TextType.displayName = 'FilterTextComponent';

export default TextType;
