import { useEffect, useState } from 'react';
import { decodeBase64 } from 'helpers/helpers';
import Tree, { moveItemOnTree, mutateTree } from '@atlaskit/tree';
import SHTemplateItem from './SHTemplateItem';
import API from 'apiHelper';

const SHTemplates = ({ nodes }) => {
  const [tree, setTree] = useState({});

  useEffect(() => {
    const newTree = makeTree(nodes);
    setTree(newTree);
  }, []);

  const onExpand = (id) => {
    setTree(mutateTree(tree, id, { isExpanded: true }));
  };

  const onCollapse = (id) => {
    setTree(mutateTree(tree, id, { isExpanded: false }));
  };

  const onDragEnd = (src, dest) => {
    if (!dest) {
      return;
    }

    if (dest?.parentId === src?.parentId) {
      // sort action
      const newTree = moveItemOnTree(tree, src, dest);
      handleSortNodes(newTree?.items[`${src?.parentId}`]?.children);
      setTree(newTree);
    } else {
      // move action
      const id = tree?.items[`${src?.parentId}`]?.children[src?.index];
      handleMoveItem(id, dest?.parentId);
      const newTree = moveItemOnTree(tree, src, dest);
      setTree(newTree);
    }
  };

  const makeTree = (data) => {
    const { Tree, AppID } = data;
    let tree = {
      rootId: AppID,
      items: {
        [`${AppID}`]: {
          id: AppID,
          children: Tree?.map((x) => x?.NodeTypeID) || [],
          hasChildren: true,
          isExpanded: false,
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
            isExpanded: false,
            isChildrenLoading: false,
          },
        };
        if (x?.Sub) {
          addLeaf(x?.Sub);
        }
      });
    };

    console.log(Tree, tree);
    addLeaf(Tree);
    return tree;
  };

  const renderItem = (props) => {
    console.log(props);
    return <SHTemplateItem {...props} onRenameSubmit={handleRenameNode} />;
  };

  const handleMoveItem = (id, parentId) => {
    API.CN.moveNodeType({
      NodeTypeID: id,
      ParentID: parentId,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const handleSortNodes = (NodeTypeIDs) => {
    API.CN.setNodeTypesOrder({
      NodeTypeIDs,
    })
      .then((res) => {
        console.log('response: ', res);
      })
      .catch((err) => {
        console.log('err: ', err);
      });
  };

  const handleRenameNode = (name, id) => {
    const data = tree?.items[`${id}`]?.data;
    setTree(mutateTree(tree, id, { data: { ...data, title: name } }));
    API.CN.renameNodeType({
      Name: name,
      NodeTypeID: id,
    }).then((res) => {
      console.log(res);
    });
  };

  return (
    <div>
      {tree.rootId && (
        <>
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
          {/* <RVTree tree={tree}>
            <SHTemplateItem />
          </RVTree> */}
        </>
      )}
    </div>
  );
};
export default SHTemplates;
