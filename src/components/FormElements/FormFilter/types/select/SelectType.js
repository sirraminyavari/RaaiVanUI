import * as Styled from '../types.styles';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import Radio from './Radio';
import Select from './Select';

const SelectType = (props) => {
  const { onChange, data } = props;

  const { Options, AutoSuggestMode } = JSON.parse(decodeBase64(data.Info));

  const handleOnChange = (e) => {
    const text = e.target.value;
    const value = {
      TextItems: [encodeBase64(e.target.value)],
      Exact: false,
    };

    onChange({
      type: 'Select',
      value: !!text ? value : null,
    });
  };

  return (
    <Styled.SelectContainer onChange={handleOnChange}>
      <Styled.SelectTitle>{data.Title}</Styled.SelectTitle>
      {AutoSuggestMode ? (
        <Select options={Options} />
      ) : (
        <Radio options={Options} />
      )}
    </Styled.SelectContainer>
  );
};

export default SelectType;
