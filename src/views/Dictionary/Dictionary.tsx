import { useState } from 'react';
import DictionaryProvider from './DictionaryProvider';
import * as Styled from './DictionaryStyles';
import Header from './items/DictionaryHeader';
import Languages from './items/DictionaryLanguages';
import SearchSection from './items/DictionarySearchSection';
import DictionarySelectedItemDetail from './items/DictionarySelectedItemDetail';

const Dictionary = () => {
  const [selected, setSelected] = useState<any>();

  const handleItemSelect = (item) => {
    setSelected(item);
  };

  return (
    <DictionaryProvider>
      <Styled.Container>
        <Header />
        <Styled.ContentWrapper>
          <SearchSection onSelect={handleItemSelect} />

          <Styled.SelectedItemContent>
            <Styled.DictionaryInputContainer>
              <Languages />
            </Styled.DictionaryInputContainer>
            <Styled.DictionaryDetail>
              <DictionarySelectedItemDetail />
            </Styled.DictionaryDetail>
          </Styled.SelectedItemContent>
        </Styled.ContentWrapper>
      </Styled.Container>
    </DictionaryProvider>
  );
};
export default Dictionary;
