/**
 * Renders a checkbox filter.
 */
import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import * as Styled from '../types.styles';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import useWindow from 'hooks/useWindowContext';
import SelectInputField from 'components/FormElements/ElementTypes/Select/SelectInputField';

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

  const [items, setItems] = useState(value ? value?.TextItems : []);
  const [exact, setExact] = useState(value ? value?.Exact : false);
  const [or, setOr] = useState(value ? value?.Or : true);

  const { GlobalUtilities } = useWindow();

  const { Options } = GlobalUtilities.to_json(decodeBase64(Info)) || {};

  //! Checkbox options.
  const options = (Options || []).map((option) => ({
    value: decodeBase64(option),
    label: decodeBase64(option),
    group: 'checkbox-filter',
  }));

  //! Fires on checkbox value change.
  const handleOnItemSelect = useCallback((items) => {
    setItems(
      items.map((item) => {
        return item.value;
      })
    );
  }, []);

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

    //! Send back value to parent on check.
    onChange({
      id,
      value: {
        Type: 'checkbox',
        TextItems: items,
        Exact: exact,
        Or: or,
        JSONValue: !items?.length ? null : JSONValue,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, exact, or]);

  //! Clear component value.
  useEffect(() => {
    if (value === undefined) {
      setItems([]);
    }
  }, [value]);

  return (
    <Styled.FilterContainer>
      <Styled.FilterTitle>{decodeBase64(Title)}</Styled.FilterTitle>

      <SelectInputField
        options={options}
        isEditable
        isFocused
        onChange={handleOnItemSelect}
        isMulti
      />
    </Styled.FilterContainer>
  );
};

CheckboxType.propTypes = {
  onChange: PropTypes.func,
  data: PropTypes.object,
  value: PropTypes.object,
};

CheckboxType.displayName = 'FilterCheckboxComponent';

export default CheckboxType;
