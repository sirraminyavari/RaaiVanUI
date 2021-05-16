import AutoSuggest from '../../../Inputs/AutoSuggestInput/AutoSuggestInput';
import * as Styled from './types.styles';

const Suggest = (props) => {
  const { onChange, data } = props;
  console.log(data);

  const handleOnItemSelect = (v) => {
    onChange(v);
  };

  return (
    <Styled.AutoSuggestContainer>
      <div>موضوعات مشابه</div>
      <AutoSuggest onItemSelect={handleOnItemSelect} />
    </Styled.AutoSuggestContainer>
  );
};

export default Suggest;
