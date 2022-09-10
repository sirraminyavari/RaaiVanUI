/**
 * Renders a binary filter.
 */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { decodeBase64 } from 'helpers/helpers';
import * as Styled from '../types.styles';
import useWindow from 'hooks/useWindowContext';
import BinaryInputField from 'components/FormElements/ElementTypes/binary/BinaryInputField';

/**
 * @typedef PropType
 * @type {Object}
 * @property {Object} value - Value of component.
 * @property {Object} data - Meta data needed for component.
 * @property {function} onChange - A callback function that fires when value changes.
 */

/**
 *  @description Renders a binary type component.
 * @component
 * @param {PropType} props -Props that are passed to component.
 */
const BinaryType = (props) => {
  const { onChange, data, value } = props;
  const { ElementID, Title, Info } = data; //! Meta data to feed component.
  const [bitValue, setBitValue] = useState(!!value ? value?.Data : undefined);

  const { GlobalUtilities } = useWindow();

  //! Binary titles.
  const { Yes, No } = GlobalUtilities.to_json(decodeBase64(Info));

  useEffect(() => {
    const id = ElementID;

    //! Send back value to parent on select.
    onChange({
      id,
      value: {
        Type: 'binary',
        Bit: bitValue === null ? null : bitValue,
        Data: bitValue,
        JSONValue: bitValue === null ? null : { Bit: bitValue },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bitValue]);

  //! Clear component value.
  useEffect(() => {
    if (value === undefined) {
      setBitValue(null);
    }
  }, [value]);

  return (
    <Styled.FilterContainer>
      <Styled.FilterTitle>{decodeBase64(Title)}</Styled.FilterTitle>
      <BinaryInputField
        isEditable
        isFocused
        noLabel={decodeBase64(No)}
        yesLabel={decodeBase64(Yes)}
        value={bitValue}
        onChange={({ value }) => {
          setBitValue(value);
        }}
      />
    </Styled.FilterContainer>
  );
};

BinaryType.propTypes = {
  onChange: PropTypes.func,
  data: PropTypes.object,
  value: PropTypes.object,
};

BinaryType.displayName = 'FilterBinaryComponent';

export default BinaryType;
