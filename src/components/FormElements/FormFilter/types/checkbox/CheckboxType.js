import AutoSuggest from '../../../../Inputs/AutoSuggestInput/AutoSuggestInput';
import * as Styled from '../types.styles';
import AtSignIcon from 'components/Icons/AtSignIcon/AtSign';
import { decodeBase64 } from 'helpers/helpers';
import Checkbox from './Checkbox';

const CheckboxType = (props) => {
  const { onChange, data } = props;

  const { Options, AutoSuggestMode } = JSON.parse(decodeBase64(data.Info));

  const handleOnItemSelect = (items) => {
    const value = {
      TextItems: items,
      Exact: false,
      Or: false,
    };

    onChange({
      type: 'Checkbox',
      value: !!items.length ? value : null,
    });
  };

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
