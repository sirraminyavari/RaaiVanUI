import { useState, useContext } from 'react';
import * as Styled from './TemplatesGallery.styles';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import DragAndDropTree from 'components/Tree/DragAndDropTree/DragAndDropTree';
import TemplateListItem from './TemplateListItem';
import treeData from './templateListData';
import { TemplatesGalleryContext, MAIN_CONTENT } from './TemplatesGallery';

const TemplateSuggestionList = () => {
  const [tree, setTree] = useState(treeData);

  const { setContent, setCurrentCategory, setCurrentTemplate } = useContext(
    TemplatesGalleryContext
  );

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
        <DragAndDropTree
          indentPerLevel={0}
          tree={tree}
          onMutateTree={handleMutateTree}
          renderItem={handleRenderItem}
        />
      </PerfectScrollbar>
    </Styled.SuggestionListContainer>
  );
};

export default TemplateSuggestionList;
