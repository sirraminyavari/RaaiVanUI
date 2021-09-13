import { useState } from 'react';
import * as Styled from './Templates-view.styles';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import { isEmpty } from 'helpers/helpers';
import DragAndDropTree from 'components/Tree/DragAndDropTree/DragAndDropTree';
import ClassItem from './ClassItem';
import ClassTemplatesList from './ClassTemplatesList';
import fakeTreeData from './fakeTreeData';

const ClassList = () => {
  const [tree, setTree] = useState(fakeTreeData);

  //! Render custom item.
  const handleRenderItem = (itemProps) => {
    const { item } = itemProps;
    if (!item?.isCategory) {
      return <ClassTemplatesList itemProps={itemProps} />;
    }
    return <ClassItem itemProps={itemProps} />;
  };

  //! Mutate tree.
  const handleMutateTree = (tree) => {
    setTree(tree);
  };

  return (
    <Styled.TemplatesListContainer>
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
    </Styled.TemplatesListContainer>
  );
};

export default ClassList;
