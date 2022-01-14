import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { decodeBase64 } from 'helpers/helpers';
import Tree, { moveItemOnTree, mutateTree } from '@atlaskit/tree';
import SHTemplateItem from './SHTemplateItem';

const SHTemplates = ({ nodes, ...rest }) => {
  const [tree, setTree] = useState({});

  useEffect(() => {
    setTree(makeTree(nodes));
  }, []);

  const onExpand = (id) => {
    setTree(mutateTree(tree, id, { isExpanded: true }));
  };

  const onCollapse = (id) => {
    setTree(mutateTree(tree, id, { isExpanded: false }));
  };

  const onDragEnd = (src, dest) => {
    console.log(src, dest);
    if (!dest) {
      return;
    }

    setTree(moveItemOnTree(tree, src, dest));
  };

  const makeTree = (data) => {
    const { Tree, AppID } = data;
    let tree = {
      rootId: AppID,
      items: {
        [`${AppID}`]: {
          children: Tree?.map((x) => x?.NodeTypeID) || [],
          hasChildren: true,
          isExpanded: true,
          isChildrenLoading: false,
        },
      },
    };

    const addLeaf = (list) => {
      list.forEach((x) => {
        tree.items = {
          ...tree.items,
          [`${x.NodeTypeID}`]: {
            id: x?.NodeTypeID,
            children: x?.Sub?.map((x) => x?.NodeTypeID) || [],
            data: { ...x, title: decodeBase64(x?.TypeName) },
            hasChildren: !!x?.Sub,
            isExpanded: true,
            isChildrenLoading: false,
          },
        };
        if (x?.Sub) {
          addLeaf(x?.Sub);
        }
      });
    };
    addLeaf(Tree);
    return tree;
  };

  const renderItem = (props) => {
    return <SHTemplateItem {...props} />;
  };

  return (
    <div>
      {tree.rootId && (
        <Tree
          tree={tree}
          renderItem={renderItem}
          onExpand={onExpand}
          onCollapse={onCollapse}
          onDragEnd={onDragEnd}
          offsetPerLevel={0}
          isDragEnabled={true}
          isNestingEnabled={true}
        />
      )}
    </div>
  );
};
const RootTree = styled.ul`
  list-style: none;
  padding: 0 1.5rem;
`;
export default SHTemplates;
