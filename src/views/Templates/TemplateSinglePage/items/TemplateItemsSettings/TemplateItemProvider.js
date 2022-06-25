import { useContext, createContext } from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useTemplateContext } from '../../TemplateProvider';
import api from 'apiHelper';
import { decodeBase64 } from 'helpers/helpers';

const TemplateItemContext = createContext({});

export const useTemplateItemContext = () => {
  const context = useContext(TemplateItemContext);
  return context;
};

export const TemplateItemProvider = ({ children }) => {
  const { RVDic } = window;
  const { title, IsTree } = useTemplateContext();
  const [nodes, setNodes] = useState([]);
  const [totalNodes, setTotalNodes] = useState();
  const [nextPageIsLoading, setNextPageIsLoading] = useState(false);
  const [isTree, setIsTree] = useState(IsTree);

  const breadItems = [
    {
      id: 1,
      title: RVDic?.TeamManagement,
      linkTo: '',
    },
    {
      id: 2,
      title: 'مدیریت قالب ها',
      linkTo: '',
    },
    {
      id: 3,
      title: `قالب ${decodeBase64(title)}`,
      linkTo: '',
    },
    {
      id: 4,
      title: 'تنظیمات پیشرفته',
      linkTo: '',
    },
  ];

  const [nodesQuery, setNodesQuery] = useState({
    searchText: '',
    LowerBoundary: 1,
    Count: 10,
  });

  const [createNewNode, setCreateNewNode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!isTree) {
        const { TotalCount, Nodes } = await api?.CN?.getNodes({
          LowerBoundary: nodesQuery?.LowerBoundary,
          Archive: nodesQuery?.Archive,
          SearchText: nodesQuery?.searchText,
        });
        setNodes([...nodes, ...Nodes]);
        setNextPageIsLoading(false);
        setTotalNodes(TotalCount);
      } else {
        const { TotalCount, Nodes } = await api?.CN?.getChildNodes({
          LowerBoundary: nodesQuery?.LowerBoundary,
          SearchText: nodesQuery?.searchText,
        });
        setNodes([...nodes, ...Nodes]);
        setNextPageIsLoading(false);
        setTotalNodes(TotalCount);
      }
    };

    fetchData();
  }, [nodesQuery, isTree]);

  const toggleArchiveState = () => {
    setNodes([]);
    setNodesQuery({
      ...nodesQuery,
      LowerBoundary: 1,
      Archive: !nodesQuery?.Archive,
    });
  };

  //! toggle tree view
  const toggleView = () => {
    setNodes([]);
    setIsTree(!isTree);
  };

  const scrollOptions = {
    offset: 200,
    onEndReach: () => {
      if (!nextPageIsLoading) {
        setNextPageIsLoading(true);
        loadMore();
      }
    },
  };

  const loadMore = () => {
    if (nodes.length >= totalNodes) return;
    const lowerBoundary = nodes?.length + 1;
    setNodesQuery({ ...nodesQuery, LowerBoundary: lowerBoundary });
  };

  return (
    <TemplateItemContext.Provider
      value={{
        nodes,
        isTree,
        createNewNode,
        setCreateNewNode,
        toggleView,
        breadItems,
        scrollOptions,
        toggleArchiveState,
        totalNodes,
        nodesQuery,
        setNodesQuery,
      }}
    >
      {children}
    </TemplateItemContext.Provider>
  );
};
