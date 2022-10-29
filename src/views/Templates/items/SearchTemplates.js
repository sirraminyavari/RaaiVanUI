import SearchInput from 'components/Inputs/SearchInput';
import * as Styled from '../settings-view/TemplatesSettings.styles';

const SearchTemplates = ({ onChange, ...rest }) => {
  return (
    <Styled.SearchInputWrapper {...rest}>
      <SearchInput
        type="text"
        style={{ width: '100%' }}
        placeholder="فیلتر بر اساس نام کلاس"
        onChange={onChange}
      />
    </Styled.SearchInputWrapper>
  );
};

export default SearchTemplates;
