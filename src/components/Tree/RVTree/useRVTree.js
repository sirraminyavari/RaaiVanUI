import { useState } from 'react';
import { getUUID } from 'helpers/helpers';
import produce from 'immer';

const useRVTree = () => {
  const [selectedNode, setSelectedNode] = useState([]);
  const [tree, setTree] = useState({});

  /**
   * @description creation top level node of tree
   * @param nodes
   */
  const setRootNodes = (nodes) => {
    setTree({
      id: getUUID(),
      _children:
        nodes?.map((x) => ({
          ...x,
          id: getUUID(),
          title: x?.title,
          isOpen: x?.isOpen || false,
          hasMore: x?.hasMore || false,
          isLoading: x?.isLoading || false,
          isSelected: x?.isSelected || false,
          hasChildren: x?.hasChildren || true,
          nodeId: x?.nodeId || null,
          typeId: x?.typeId || null,
          draggable: x?.draggable || false,
          _children: x?._children || [],
        })) || [],
    });
  };

  /**
   * @description create new node
   * @param parentId
   * @param title
   */
  const createNode = (parentId, title) => {};

  /**
   * @description delete node by id
   * @param id
   */
  const deleteNode = (id) => {};

  /**
   * @description drag and drop node
   * @param srcId
   * @param dstId
   */
  const moveNode = (srcId, dstId) => {};

  /**
   * @description rename node by id
   * @param id
   * @param title
   */
  const renameNode = (id, title) => {};

  /**
   * @description update node children
   * @param id
   * @param children
   * @param hasMore
   */
  const updateNodeChildren = (id, children, hasMore) => {
    setTree(
      produce((draft) => {
        const foundNode = _findNode(draft, id);

        if (foundNode !== null) {
          foundNode._children = foundNode?._children
            ?.concat(children)
            ?.sort((firstEl, secondEl) => {
              if (firstEl?.hasChildren && !secondEl?.hasChildren) return -1;
              if (!firstEl?.hasChildren && secondEl?.hasChildren) return 1;
              return 0;
            });
          foundNode.hasMore = hasMore;
          foundNode.isLoading = false;
        }
      })
    );
  };

  /**
   * @description set state of node loading data
   * @param id
   * @param state
   */
  const setNodeLoadingState = (id, state) => {
    setTree(
      produce((draft) => {
        const foundNode = _findNode(draft, id);
        if (foundNode !== null) {
          foundNode.isLoading = state;
        }
      })
    );
  };

  /**
   * @description open on set loading node by id
   * @param id
   */
  const setNodeOpenLoading = (id) => {
    setTree(
      produce((draft) => {
        const foundNode = _findNode(draft, id);
        if (foundNode !== null) {
          foundNode.isOpen = true;
          foundNode.isLoading = true;
        }
      })
    );
  };

  /**
   * @param node
   */
  const handleNodeSelection = (node) => {
    if (!node.selectable) return;
    // add to selected nodes array
    const exist = selectedNode?.find((x) => x.id === node?.id);
    if (!exist) {
      setSelectedNode([...selectedNode, node]);
    } else {
      setSelectedNode(selectedNode.filter((x) => x.id === node?.id));
    }

    // update tree state
    setTree(
      produce((draft) => {
        const foundNode = _findNode(draft, node?.id);
        if (foundNode !== null) {
          foundNode.isSelected = !foundNode.isSelected;
        }
      })
    );
  };

  /**
   *
   */
  const handleResetSelectedNode = () => {
    setSelectedNode([]);

    // update tree state
    setTree(
      produce((draft) => {
        _resetSelection(draft);
      })
    );
  };

  /**
   * @description open and close node by id
   * @param id
   * @param state {boolean}
   */
  const setNodeOpenState = (id, state) => {
    setTree(
      produce((draft) => {
        const foundNode = _findNode(draft, id);
        if (foundNode !== null) {
          foundNode.isOpen = state;
        }
      })
    );
  };

  /**
   * @param node
   * @param callback
   */
  const openNode = (node, callback) => {
    if (!node?.isOpen) {
      if (node?.hasChildren && node?._children?.length !== 0) {
        // open node without fetching data
        setNodeOpenState(node?.id, true);
      } else if (node?.hasChildren && node?._children?.length === 0) {
        // set open: true and loading: true
        setNodeOpenLoading(node?.id);
        callback();
      }
    } else {
      // the node is open already, so just close it
      setNodeOpenState(node?.id, false);
    }
  };

  /**
   * @description recursive function for finding specific node by {id}
   * @param node node to start searching from, the root node in case of searching the whole tree
   * @param id
   * @returns {null|*}
   */
  const _findNode = (node, id) => {
    if (node.id === id) {
      return node;
    } else if (node._children !== null) {
      let result = null;
      for (let i = 0; result === null && i < node?._children?.length; i++) {
        result = _findNode(node?._children[i], id);
      }
      return result;
    }
    return null;
  };

  /**
   * @description loop through the tree and reset all selected items
   * @param node
   * @private
   */
  const _resetSelection = (node) => {
    if (node.isSelected === true) {
      node.isSelected = false;
    }
    for (let i = 0; i < node?._children?.length; i++) {
      _resetSelection(node?._children[i]);
    }
  };

  return {
    tree,
    setRootNodes,
    createNode,
    deleteNode,
    moveNode,
    renameNode,
    updateNodeChildren,
    setNodeLoadingState,
    handleNodeSelection,
    setNodeOpenLoading,
    handleResetSelectedNode,
    setNodeOpenState,
  };
};
export default useRVTree;
