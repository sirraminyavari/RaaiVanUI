import { useState } from 'react';
import { getUUID } from '../../helpers/helpers';

const useCoreTree = () => {
  const [tree, setTree] = useState({});

  const setRootNodes = (_nodes) => {
    setTree({
      id: getUUID(),
      nodes: _nodes?.map((x) => ({
        ...x,
        id: getUUID(),
        title: x?.title,
        nodes: _nodes?.nodes || [],
      })),
    });
  };

  return {
    tree,
    setRootNodes,
  };
};
export default useCoreTree;
