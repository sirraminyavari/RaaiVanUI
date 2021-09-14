import { useState, useEffect } from 'react';
import * as Styled from './Templates-view.styles';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import { isEmpty } from 'helpers/helpers';
import DragAndDropTree from 'components/Tree/DragAndDropTree/DragAndDropTree';
import ClassItem from './ClassItem';
import ClassTemplatesList from './ClassTemplatesList';
import provideTree from './provideTreeData';
import { getChildNodeTypes } from 'apiHelper/apiFunctions';

const ClassList = () => {
  const [tree, setTree] = useState({});

  useEffect(() => {
    getChildNodeTypes()
      .then((response) => {
        // console.log({ response });
        setTree(provideTree(response));
      })
      .catch((err) => console.log(err));
  }, []);

  //! Render custom item.
  const handleRenderItem = (itemProps) => {
    const { item } = itemProps;

    if (!item?.isCategory) {
      return (
        <ClassTemplatesList
          tree={tree}
          setTree={setTree}
          itemProps={itemProps}
        />
      );
    }
    return <ClassItem tree={tree} setTree={setTree} itemProps={itemProps} />;
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
