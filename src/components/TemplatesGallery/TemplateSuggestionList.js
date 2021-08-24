import { useState } from 'react';
import * as Styled from './TemplatesGallery.styles';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import DragAndDropTree from 'components/Tree/DragAndDropTree/DragAndDropTree';
import TemplateItem from './TemplateItem';

const treeData = {
  rootId: '1',
  items: {
    1: {
      id: '1',
      children: ['1-1', '1-2', '1-3'],
      hasChildren: true,
      isCategory: true,
      isExpanded: true,
      isChildrenLoading: false,
      data: {
        title: 'root',
      },
    },
    '1-3': {
      id: '1-3',
      children: [],
      hasChildren: false,
      isCategory: true,
      isExpanded: false,
      isChildrenLoading: false,
      data: {
        title: 'Main 2',
      },
    },
    '1-1': {
      id: '1-1',
      children: ['1-1-1', '1-1-2'],
      hasChildren: true,
      isCategory: true,
      isExpanded: false,
      isChildrenLoading: false,
      data: {
        title: 'First parent',
      },
    },
    '1-2': {
      id: '1-2',
      children: ['1-2-1', '1-2-2'],
      hasChildren: true,
      isCategory: true,
      isExpanded: false,
      isChildrenLoading: false,
      data: {
        title: 'Second parent',
      },
    },
    '1-1-1': {
      id: '1-1-1',
      children: [],
      hasChildren: false,
      isCategory: false,
      isExpanded: false,
      isChildrenLoading: false,
      data: {
        title: 'Child one',
      },
    },
    '1-1-2': {
      id: '1-1-2',
      children: [],
      hasChildren: false,
      isCategory: false,
      isExpanded: false,
      isChildrenLoading: false,
      data: {
        title: 'Child two',
      },
    },
    '1-2-1': {
      id: '1-2-1',
      children: [],
      hasChildren: false,
      isCategory: false,
      isExpanded: false,
      isChildrenLoading: false,
      data: {
        title: 'Child three',
      },
    },
    '1-2-2': {
      id: '1-2-2',
      children: ['1-1-2-2', '1-1-2-1'],
      hasChildren: true,
      isCategory: false,
      isExpanded: true,
      isChildrenLoading: false,
      data: {
        title: 'Child four',
      },
    },
    '1-1-2-1': {
      id: '1-1-2-1',
      children: [],
      hasChildren: false,
      isCategory: false,
      isExpanded: false,
      isChildrenLoading: false,
      data: {
        title: 'Child six',
      },
    },
    '1-1-2-2': {
      id: '1-1-2-2',
      children: [],
      hasChildren: false,
      isCategory: false,
      isExpanded: false,
      isChildrenLoading: false,
      data: {
        title: 'Child five',
      },
    },
  },
};

const TemplateSuggestionList = () => {
  const [tree, setTree] = useState(treeData);

  //! Mutate tree.
  const handleMutateTree = (tree) => {
    setTree(tree);
  };

  //! Render custom item.
  const handleRenderItem = (itemProps) => {
    return <TemplateItem itemProps={itemProps} />;
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
