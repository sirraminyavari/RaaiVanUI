import { useContext } from 'react';
import * as Styled from 'views/Search/SearchView.styles';
import { searchContext } from 'views/Search/SearchView';
import AsideHeader from './AsideHeader';
import TemplateSelection from './TemplateSelection';
import Toggles from './Toggles';

const SearchAside = () => {
  const { selectedType } = useContext(searchContext);

  //! See if we can show the template selection.
  const isNodeSearch = selectedType?.value?.split('|').includes('Node');

  return (
    <Styled.SearchViewAside>
      <AsideHeader />
      <div style={{ padding: '1rem' }}>
        {isNodeSearch && (
          <>
            <TemplateSelection />
            <Styled.Divider />
          </>
        )}
        <Toggles />
      </div>
    </Styled.SearchViewAside>
  );
};

export default SearchAside;
