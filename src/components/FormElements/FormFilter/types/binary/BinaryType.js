import { decodeBase64 } from 'helpers/helpers';
import * as Styled from '../types.styles';
import Radio from '../../../../Inputs/radio/Radio';

const BinaryType = (props) => {
  const { onChange, data } = props;
  const { Yes, No } = JSON.parse(decodeBase64(data.Info));

  const options = [
    { value: 'yes', title: decodeBase64(Yes), group: 'binaryFilter' },
    { value: 'no', title: decodeBase64(No), group: 'binaryFilter' },
  ];

  const handleOnBinarySelect = (bitValue) => {
    onChange({
      type: 'Binary',
      value: bitValue === null ? null : { Bit: bitValue === 'yes' },
    });
  };

  return (
    <Styled.UserContainer>
      <Styled.UserTitle>{data.Title}</Styled.UserTitle>
      <Radio options={options} onSelect={handleOnBinarySelect} />
    </Styled.UserContainer>
  );
};

export default BinaryType;
