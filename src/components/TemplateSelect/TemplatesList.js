import { useContext } from 'react';
import { TemplateSelectContext } from './TemplateSelect';
import * as Styled from './TemplateSelect.styles';
import ScrollBarProvider from 'components/ScrollBarProvider/ScrollBarProvider';
import DragAndDropTree from 'components/Tree/DragAndDropTree/DragAndDropTree';
import TemplateListItem from './TemplateListItem';
import { isEmpty } from 'helpers/helpers';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';

const TemplatesList = () => {
  const { nodeTree, setNodeTree } = useContext(TemplateSelectContext);

  //! Mutate tree.
  const handleMutateTree = (tree) => {
    setNodeTree(tree);
  };

  //! Render custom item.
  const handleRenderItem = (itemProps) => {
    return <TemplateListItem itemProps={itemProps} />;
  };

  return (
    <Styled.TemplatesListContainer>
      <Styled.TemplateListTitle>لیست دسته و کلاس‌ها</Styled.TemplateListTitle>
      <ScrollBarProvider>
        {isEmpty(nodeTree) ? (
          <LogoLoader />
        ) : (
          <DragAndDropTree
            indentPerLevel={0}
            tree={nodeTree}
            onMutateTree={handleMutateTree}
            renderItem={handleRenderItem}
          />
        )}
      </ScrollBarProvider>
    </Styled.TemplatesListContainer>
  );
};

export default TemplatesList;
