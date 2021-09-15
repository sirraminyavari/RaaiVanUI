import { useContext } from 'react';
import * as Styled from './Templates-view.styles';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import { isEmpty } from 'helpers/helpers';
import DragAndDropTree from 'components/Tree/DragAndDropTree/DragAndDropTree';
import TreeCategoryItem from './TreeCategoryItem';
import TreeTemplatesList from './TreeTemplatesList';
import { TemplatesViewContext } from './Templates-view';

const ClassList = () => {
  const { tree, setTree } = useContext(TemplatesViewContext);

  //! Render custom item.
  const handleRenderItem = (itemProps) => {
    const { item } = itemProps;

    if (!item?.isCategory) {
      return (
        <TreeTemplatesList
          tree={tree}
          setTree={setTree}
          itemProps={itemProps}
        />
      );
    }
    return (
      <TreeCategoryItem tree={tree} setTree={setTree} itemProps={itemProps} />
    );
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
