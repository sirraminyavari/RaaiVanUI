/**
 * Renders a select filter.
 */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Styled from '../types.styles';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import Checkbox from 'components/Inputs/checkbox/Checkbox';
import ExactFilter from 'components/FormElements/FormFilter/items/ExactToggle';

/**
 * @typedef PropType
 * @type {Object}
 * @property {Object} value - Value of component.
 * @property {Object} data - Meta data needed for component.
 * @property {function} onChange - A callback function that fires when value changes.
 */

/**
 *  @description Renders a select type component.
 * @component
 * @param {PropType} props -Props that are passed to component.
 */
const SelectType = (props) => {
  const { onChange, data, value } = props;
  const { ElementID, Title, Info } = data; //! Meta data to feed component.
  const { Options, AutoSuggestMode } = JSON.parse(decodeBase64(Info));

  const [items, setItems] = useState(!!value ? value.TextItems : []);
  const [exact, setExact] = useState(!!value ? value.Exact : false);

  //! Select options.
  const options = Options.map((option) => ({
    value: decodeBase64(option),
    title: decodeBase64(option),
    group: 'select-filter',
  }));

  const handleOnChange = (item) => {
    if (!item.isChecked) {
      setItems((oldItems) => oldItems.filter((c) => c !== item.value));
    } else {
      setItems((oldItems) => [...oldItems, item.value]);
    }
  };

  //! Fires on 'Exact' toggle change.
  const handleExactFilter = (exactValue) => {
    setExact(exactValue);
  };

  useEffect(() => {
    const id = ElementID;
    const JSONValue = {
      TextItems: items.map((item) => encodeBase64(item)),
      Exact: !items.length ? false : exact,
    };

    //! Send back value to parent on select.
    onChange({
      id,
      value: {
        Type: 'select',
        TextItems: items,
        Exact: !items.length ? false : exact,
        JSONValue: !items.length ? null : JSONValue,
      },
    });
  }, [items, exact]);

  //! Clear component value.
  useEffect(() => {
    if (value === undefined) {
      setItems([]);
    }
  }, [value]);

  return (
    <Styled.SelectContainer>
      <Styled.FilterTitle>{decodeBase64(Title)}</Styled.FilterTitle>
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

SelectType.propTypes = {
  onChange: PropTypes.func,
  data: PropTypes.object,
  value: PropTypes.object,
};

SelectType.displayName = 'FilterSelectComponent';

export default SelectType;
