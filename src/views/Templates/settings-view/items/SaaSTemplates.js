import { useEffect, useState } from 'react';
import { decodeBase64, getUUID } from 'helpers/helpers';
import Tree from '@atlaskit/tree';
import provideTree from '../provideTreeData';

const SaaSTemplates = ({ nodes, ...rest }) => {
  const [tree, setTree] = useState({
    rootId: getUUID(),
    items: {},
  });

  useEffect(() => {
    if (nodes) {
      const a = provideTree(nodes);
      console.log(a);
      // setTree(a);
    }
  }, [nodes]);

  const handleDragEnd = (e) => {
    console.log(e);
  };

  const treeItem = ({
    item,
    onExpand,
    onCollapse,
    provided,
    snapshot,
    ...rest
  }) => {
    return (
      <div ref={provided.innerRef} {...provided.draggableProps}>
        <div>{item.data ? item.data.title : ''}</div>
      </div>
    );
  };

  return <div>.....</div>;
};

export default SaaSTemplates;
