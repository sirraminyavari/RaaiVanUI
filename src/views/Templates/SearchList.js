import { useContext } from 'react';
import { TemplatesViewContext } from './Templates-view';
import * as Styled from './Templates-view.styles';
import TemplateCard from 'components/TemplatesGallery/TemplateCard';

const SearchList = () => {
  const { searchResult } = useContext(TemplatesViewContext);
  //   console.log(searchResult);

  return (
    <Styled.ClassTemplatesContainer isSearchList>
      {searchResult?.map((template, key) => (
        <TemplateCard
          containerClass="class-template-card"
          mode="grid"
          key={key}
          template={template}
        />
      ))}
    </Styled.ClassTemplatesContainer>
  );
};

export default SearchList;
