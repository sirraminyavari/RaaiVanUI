import { useContext } from 'react';
import * as Styled from 'views/Search/SearchView.styles';
import { searchContext } from 'views/Search/SearchView';
import AsideHeader from './AsideHeader';
import TemplateSelection from './TemplateSelection';
import NodeToggles from './NodeToggles';
import QuestionToggles from './QuestionToggles';
import FileToggles from './FileToggles';

const SearchAside = () => {
  const { selectedType } = useContext(searchContext);

  //! See if we can show the template selection.
  const isNodeSearch = selectedType?.value === 'Node';
  const isQuestionSearch = selectedType?.value === 'Question';
  const isFileSearch = selectedType?.value === 'File';

  return (
    <Styled.SearchViewAside>
      <AsideHeader />
      <div style={{ padding: '1rem' }}>
        {isNodeSearch && (
          <>
            <TemplateSelection />
            <Styled.Divider />
            <NodeToggles />
          </>
        )}
        {isQuestionSearch && <QuestionToggles />}
        {isFileSearch && <FileToggles />}
      </div>
    </Styled.SearchViewAside>
  );
};

export default SearchAside;
