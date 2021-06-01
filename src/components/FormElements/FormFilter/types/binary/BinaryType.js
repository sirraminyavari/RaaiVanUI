/**
 * Renders a binary filter.
 */
import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { decodeBase64 } from 'helpers/helpers';
import * as Styled from '../types.styles';
import Radio from 'components/Inputs/radio/Radio';

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
  const [bitValue, setBitValue] = useState(!!value ? value.Data : null);

  //! Binary titles.
  const { Yes, No } = JSON.parse(decodeBase64(Info));

  //! Binary options.
  const options = [
    { value: 'yes', title: decodeBase64(Yes), group: 'binary-filter' },
    { value: 'no', title: decodeBase64(No), group: 'binary-filter' },
  ];

  const handleOnBinarySelect = useCallback((bitValue) => {
    setBitValue(bitValue);
  }, []);

  useEffect(() => {
    const id = ElementID;

    //! Send back value to parent on select.
    onChange({
      id,
      value: {
        Type: 'binary',
        Bit: bitValue === null ? null : bitValue === 'yes',
        Data: bitValue,
        JSONValue: bitValue === null ? null : { Bit: bitValue === 'yes' },
      },
    });
  }, [bitValue]);

  //! Clear component value.
  useEffect(() => {
    if (value === undefined) {
      setBitValue(null);
    }
  }, [value]);

  return (
    <Styled.UserContainer>
      <Styled.UserTitle>{decodeBase64(Title)}</Styled.UserTitle>
      <Radio
        options={options}
        onSelect={handleOnBinarySelect}
        selected={value?.Data}
      />
    </Styled.UserContainer>
  );
};

BinaryType.propTypes = {
  onChange: PropTypes.func,
  data: PropTypes.object,
  value: PropTypes.object,
};

BinaryType.displayName = 'FilterBinaryComponent';

export default BinaryType;
