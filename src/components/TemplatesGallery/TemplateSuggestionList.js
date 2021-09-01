import { useContext } from 'react';
import * as Styled from './TemplatesGallery.styles';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import DragAndDropTree from 'components/Tree/DragAndDropTree/DragAndDropTree';
import TemplateListItem from './TemplateListItem';
import { TemplatesGalleryContext, MAIN_CONTENT } from './TemplatesGallery';
import { isEmpty } from 'helpers/helpers';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';

const TemplateSuggestionList = () => {
  const {
    setContent,
    setCurrentCategory,
    setCurrentTemplate,
    tree,
    setTree,
  } = useContext(TemplatesGalleryContext);

  //! Change content on click.
  const handleClickTitle = () => {
    setContent({ name: MAIN_CONTENT, data: {} });
    setCurrentCategory(null);
    setCurrentTemplate(null);
  };

  //! Mutate tree.
  const handleMutateTree = (tree) => {
    setTree(tree);
  };

  //! Render custom item.
  const handleRenderItem = (itemProps) => {
    return <TemplateListItem itemProps={itemProps} />;
  };

  return (
    <Styled.SuggestionListContainer>
      <Styled.SuggestionListTitle onClick={handleClickTitle}>
        پیشنهاد کلیک‌مایند
      </Styled.SuggestionListTitle>
      <PerfectScrollbar className="template-suggestion-list-scrollbar">
        {isEmpty(tree) ? (
          <LogoLoader />
        ) : (
          <DragAndDropTree
            indentPerLevel={0}
            tree={tree}
            onMutateTree={handleMutateTree}
            renderItem={handleRenderItem}
          />
        )}
      </PerfectScrollbar>
    </Styled.SuggestionListContainer>
  );
};

export default TemplateSuggestionList;
