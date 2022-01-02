import { useState } from 'react';
import { getUUID } from 'helpers/helpers';
import produce from 'immer';

const useLazyPaginatedTree = () => {
  const [selectedNode, setSelectedNode] = useState([]);
  const [tree, setTree] = useState({
    name: null,
    items: [],
  });

  /**
   * @description init tree root item
   * @param nodes
   * @param selectable
   */
  const setRoot = (nodes, selectable = false) => {
    setTree(() => ({
      id: getUUID(),
      Name: null,
      items:
        nodes?.map((x) => ({
          ...x,
          selectable,
          id: getUUID(),
          items: [],
          isOpen: false,
          hasMore: false,
          isLoading: false,
          isSelected: false,
          hasChildren: true,
          NodeID: x.NodeID ?? null,
          NodeTypeID: x.NodeTypeID ?? null,
          SearchText: '',
        })) || [],
    }));
  };

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
          foundNode.items = foundNode?.items
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
   *
   * @param node
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
   *
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
   *
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
   *
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

  const _findNode = (node, id) => {
    if (node.id === id) {
      return node;
    } else if (node.items !== null) {
      let result = null;
      for (let i = 0; result === null && i < node?.items?.length; i++) {
        result = _findNode(node?.items[i], id);
      }
      return result;
    }
    return null;
  };

  const _resetSelection = (node) => {
    if (node.isSelected === true) {
      node.isSelected = false;
    }
    for (let i = 0; i < node?.items?.length; i++) {
      _resetSelection(node?.items[i]);
    }
  };

  return {
    root: tree,
    setRoot,
    selectedNode,
    handleResetSelectedNode,
    updateNodeChildren,
    setNodeLoadingState,
    setNodeOpenState,
    setNodeOpenLoading,
    handleNodeSelection,
  };
};
export default useLazyPaginatedTree;
