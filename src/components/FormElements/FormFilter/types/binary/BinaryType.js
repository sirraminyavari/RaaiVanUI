import { useState, useEffect, useCallback } from 'react';
import { decodeBase64 } from 'helpers/helpers';
import * as Styled from '../types.styles';
import Radio from '../../../../Inputs/radio/Radio';

const BinaryType = (props) => {
  const { onChange, data, value } = props;
  const { Yes, No } = JSON.parse(decodeBase64(data.Info));
  const [bitValue, setBitValue] = useState(null);

  const options = [
    { value: 'yes', title: decodeBase64(Yes), group: 'binaryFilter' },
    { value: 'no', title: decodeBase64(No), group: 'binaryFilter' },
  ];

  const handleOnBinarySelect = useCallback((bitValue) => {
    setBitValue(bitValue);
  }, []);

  useEffect(() => {
    const id = data.ElementID;
    onChange({
      id,
      value: {
        Bit: bitValue === null ? null : bitValue === 'yes',
        Data: bitValue,
        JSONValue: bitValue === null ? null : { Bit: bitValue === 'yes' },
      },
    });
  }, [bitValue]);

  useEffect(() => {
    // const id = data.ElementID;
    if (value === undefined) {
      setBitValue(null);
      // onChange({
      //   id,
      //   value: { Bit: null, Data: null, JSONValue: null },
      // });
    }
  }, [value]);

  return (
    <Styled.UserContainer>
      <Styled.UserTitle>{data.Title}</Styled.UserTitle>
      <Radio
        options={options}
        onSelect={handleOnBinarySelect}
        selected={value?.Data}
      />
    </Styled.UserContainer>
  );
};

export default BinaryType;
