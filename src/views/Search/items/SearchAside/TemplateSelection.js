import * as Styled from 'views/Search/SearchView.styles';
import AtSignIconIcon from 'components/Icons/AtSignIcon/AtSign';
import { CV_DISTANT } from 'constant/CssVariables';

const TemplateSelection = () => {
  return (
    <Styled.TemplateSelection>
      <Styled.SelectionTitle>
        <AtSignIconIcon color={CV_DISTANT} />
        <div>انتخاب تمپلیت برای جستجو</div>
      </Styled.SelectionTitle>
      <div>field ???</div>
    </Styled.TemplateSelection>
  );
};

export default TemplateSelection;
