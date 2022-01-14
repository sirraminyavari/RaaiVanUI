import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { decodeBase64 } from 'helpers/helpers';
import Tree from '@atlaskit/tree';
import SHTemplateItem from './SHTemplateItem';

const SHTemplates = ({ nodes, ...rest }) => {
  const [tree, setTree] = useState({});

  useEffect(() => {
    console.log(nodes);
    console.log(makeTree(nodes));
    setTree(makeTree(nodes));
  }, []);

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
    console.log(props);
    return <SHTemplateItem {...props} />;
  };

  return (
    <div>
      {tree.rootId && (
        <Tree
          tree={tree}
          renderItem={renderItem}
          offsetPerLevel={100}
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
