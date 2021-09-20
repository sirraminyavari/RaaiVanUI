import SearchIcon from 'components/Icons/SearchIcon/Search';
import Input from 'components/Inputs/Input';
import { CV_DISTANT } from 'constant/CssVariables';
import * as Styled from '../settings-view/TemplatesSettings.styles';

const SearchTemplates = ({ onChange, ...rest }) => {
  return (
    <Styled.SearchInputWrapper {...rest}>
      <Input
        type="text"
        style={{ width: '100%' }}
        placeholder="فیلتر بر اساس نام کلاس"
        onChange={onChange}
      />
      <SearchIcon
        size={20}
        color={CV_DISTANT}
        className="templates-view-input-icon"
      />
    </Styled.SearchInputWrapper>
  );
};

export default SearchTemplates;
