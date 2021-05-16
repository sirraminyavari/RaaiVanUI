import AutoSuggest from '../../../Inputs/AutoSuggestInput/AutoSuggestInput';
import * as Styled from './types.styles';
import AtSignIcon from 'components/Icons/AtSignIcon/AtSign';

const SuggestType = (props) => {
  const { onChange, data } = props;
  console.log(data);

  const handleOnItemSelect = (v) => {
    onChange({ type: 'SuggestType', value: v });
  };

  return (
    <Styled.AutoSuggestContainer>
      <Styled.SuggestTitleWrapper>
        <AtSignIcon />
        <Styled.AutoSuggestTitle>موضوعات مشابه</Styled.AutoSuggestTitle>
      </Styled.SuggestTitleWrapper>
      <AutoSuggest
        onItemSelect={handleOnItemSelect}
        placeholder="موضوع مورد نظر خود را انتخاب نمایید"
      />
    </Styled.AutoSuggestContainer>
  );
};

export default SuggestType;
