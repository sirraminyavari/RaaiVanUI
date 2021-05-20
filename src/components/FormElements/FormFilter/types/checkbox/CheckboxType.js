import { useCallback } from 'react';
import AutoSuggest from 'components/Inputs/AutoSuggestInput/AutoSuggestInput';
import * as Styled from '../types.styles';
import AtSignIcon from 'components/Icons/AtSignIcon/AtSign';
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
      <Styled.CheckboxTitleWrapper>
        <AtSignIcon />
        <Styled.CheckboxTitle>{data.Title}</Styled.CheckboxTitle>
      </Styled.CheckboxTitleWrapper>
      {AutoSuggestMode ? (
        <AutoSuggest
          defaultItems={Options}
          onItemSelect={handleOnItemSelect}
          placeholder="موضوع مورد نظر خود را انتخاب نمایید"
        />
      ) : (
        <Checkbox options={Options} onSelect={handleOnItemSelect} />
      )}
    </Styled.CheckboxContainer>
  );
};

export default CheckboxType;
