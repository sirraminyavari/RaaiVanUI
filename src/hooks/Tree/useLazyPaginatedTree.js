import useCoreTree from './useCoreTree';

const useLazyPaginatedTree = (nodes) => {
  const { tree, findNode, setRootNodes: _setRootNode } = useCoreTree();

  const setRootNode = (nodes) => {
    _setRootNode({
      ...nodes,
    });
  };
};
export default useLazyPaginatedTree;
