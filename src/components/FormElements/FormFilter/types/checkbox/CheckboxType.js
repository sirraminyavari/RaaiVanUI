import { useCallback } from 'react';
import * as Styled from '../types.styles';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import Checkbox from 'components/Inputs/checkbox/Checkbox';

const CheckboxType = (props) => {
  const { onChange, data } = props;

  const { Options, AutoSuggestMode } = JSON.parse(decodeBase64(data.Info));

  const handleOnItemSelect = useCallback((items) => {
    const value = {
      TextItems: items.map((item) => encodeBase64(item)),
      Exact: false,
      Or: false,
    };

    onChange({
      type: 'Checkbox',
      value: !!items.length ? value : null,
    });
  }, []);

  return (
    <Styled.CheckboxContainer>
      <Styled.CheckboxTitle>{data.Title}</Styled.CheckboxTitle>
      {AutoSuggestMode ? (
        <div>Checkbox</div>
      ) : (
        <Checkbox options={Options} onSelect={handleOnItemSelect} />
      )}
    </Styled.CheckboxContainer>
  );
};

export default CheckboxType;
