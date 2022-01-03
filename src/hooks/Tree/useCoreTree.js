import { useState } from 'react';
import { getUUID } from '../../helpers/helpers';

const useCoreTree = () => {
  const [tree, setTree] = useState({});

  /**
   *
   * @description creation top level node of tree
   * @param _nodes
   */
  const setRootNodes = (_nodes) => {
    setTree({
      id: getUUID(),
      nodes: _nodes?.map((x) => ({
        ...x,
        id: getUUID(),
        title: x?.title,
        state: false,
        nodes: _nodes?.nodes || [],
      })),
    });
  };

  /**
   * @description recursive function for finding specific node by {id}
   * @param node node to start searching from, the root node in case of searching the whole tree
   * @param id
   * @returns {null|*}
   */
  const findNode = (node, id) => {
    if (node.id === id) {
      return node;
    } else if (node.items !== null) {
      let result = null;
      for (let i = 0; result === null && i < node?.items?.length; i++) {
        result = findNode(node?.items[i], id);
      }
      return result;
    }
    return null;
  };

  return {
    tree,
    setRootNodes,
    findNode,
  };
};
export default useCoreTree;
