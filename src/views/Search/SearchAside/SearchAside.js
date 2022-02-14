import { useContext } from 'react';
import * as Styled from 'views/Search/SearchView.styles';
import { searchContext } from 'views/Search/SearchView';
import AsideHeader from './AsideHeader';
import TemplateSelection from './TemplateSelection';
import NodeToggles from './NodeToggles';
import QuestionToggles from './QuestionToggles';
import FileToggles from './FileToggles';
import styled from 'styled-components';
import { BG_GRAY_LIGHT } from 'constant/Colors';
import { BO_RADIUS_QUARTER } from 'constant/constants';

const SearchAside = () => {
  const { selectedType, isAsideOpen } = useContext(searchContext);

  //! See if we can show the template selection.
  const isNodeSearch =
    !!selectedType?.value?.length &&
    (selectedType?.value).every((t) => t === 'Node');
  const isQuestionSearch =
    !!selectedType?.value?.length &&
    (selectedType?.value).every((t) => t === 'Question');
  const isFileSearch =
    !!selectedType?.value?.length &&
    (selectedType?.value).every((t) => t === 'File');

  return (
    <SearchViewAside isOpen={isAsideOpen}>
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
    </SearchViewAside>
  );
};

export default SearchAside;

const SearchViewAside = styled.aside.attrs({
  className: `${BG_GRAY_LIGHT} ${BO_RADIUS_QUARTER}`,
})`
  box-shadow: 1px 3px 15px #00000026;
  width: ${({ isOpen }) => (isOpen ? '18rem' : 0)};
  display: ${({ isOpen }) => (isOpen ? '' : 'none')};
  transition: display 0.5s, width 0.5s;
`;
