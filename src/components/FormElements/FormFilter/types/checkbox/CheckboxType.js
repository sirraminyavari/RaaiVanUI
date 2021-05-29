/**
 * Renders a checkbox filter.
 */
import { useCallback, useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import * as Styled from '../types.styles';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import Checkbox from 'components/Inputs/checkbox/Checkbox';
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
 *  @description Renders a checkbox type component.
 * @component
 * @param {PropType} props -Props that are passed to component.
 */
const CheckboxType = (props) => {
  const { onChange, data, value } = props;
  const { ElementID, Title, Info } = data; //! Meta data to feed component.

  const { RVDic } = useContext(WindowContext);
  const [items, setItems] = useState(value ? value.TextItems : []);
  const [exact, setExact] = useState(value ? value.Exact : false);
  const [or, setOr] = useState(value ? value.Or : true);

  const { Options, AutoSuggestMode } = JSON.parse(decodeBase64(Info));
  //! Checkbox options.
  const options = Options.map((option) => ({
    value: decodeBase64(option),
    title: decodeBase64(option),
    group: 'checkbox-filter',
  }));

  //! Options for 'OrAnd' select;
  const orOptions = [
    { value: 'or', title: RVDic.Or },
    { value: 'and', title: RVDic.And },
  ];

  //! Fires on checkbox value change.
  const handleOnItemSelect = useCallback((item) => {
    if (!item.isChecked) {
      setItems((oldItems) => oldItems.filter((c) => c !== item.value));
    } else {
      setItems((oldItems) => [...oldItems, item.value]);
    }
  }, []);

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

    //! Send back value to parent on check.
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

  //! Clear component value.
  useEffect(() => {
    if (value === undefined) {
      setItems([]);
    }
  }, [value]);

  return (
    <Styled.CheckboxContainer>
      <Styled.CheckboxTitle>{decodeBase64(Title)}</Styled.CheckboxTitle>
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

CheckboxType.propTypes = {
  onChange: PropTypes.func,
  data: PropTypes.object,
  value: PropTypes.object,
};

CheckboxType.displayName = 'FilterCheckboxComponent';

export default CheckboxType;
