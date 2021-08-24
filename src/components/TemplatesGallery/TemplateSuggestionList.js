import { useState } from 'react';
import * as Styled from './TemplatesGallery.styles';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import DragAndDropTree from 'components/Tree/DragAndDropTree/DragAndDropTree';
import TemplateListItem from './TemplateListItem';
import treeData from './templateListData';

const TemplateSuggestionList = () => {
  const [tree, setTree] = useState(treeData);

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
      <Styled.SuggestionListTitle>
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
