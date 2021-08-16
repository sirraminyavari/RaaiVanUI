import { useEffect, useState } from 'react';
import * as Styled from 'views/Profile/Profile.styles';
import TabItem from './TabItem';
import useWindow from 'hooks/useWindowContext';
// import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';

const DEFAULT_TAB = 'all-classes';
// const MORE_TAB = 'more-classes';

const LastTopicsTabs = ({ relatedNodes, provideNodes }) => {
  const [isMoreShown, setIsMoreShown] = useState(false);
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB);
  const { RVDic } = useWindow();

  useEffect(() => {
    if (relatedNodes) {
      const nodeTypeIds = relatedNodes?.NodeTypes?.map(
        (nodeType) => nodeType?.NodeTypeID
      ).join('|');
      provideNodes(nodeTypeIds);
    }
  }, [relatedNodes]);

  const allNodesCount = relatedNodes?.NodeTypes?.reduce(
    (acc, prev) => acc + prev?.Count,
    0
  );

  const sortedNodes = relatedNodes?.NodeTypes?.slice().sort(
    (a, b) => b.Count - a.Count
  );

  const moreNodesCount = sortedNodes
    ?.filter((node, index) => {
      if (index < 3) return false;
      return true;
    })
    ?.reduce((acc, prev) => acc + prev?.Count, 0);

  // console.log(moreNodesCount);

  const handleMoreTopics = () => {
    setIsMoreShown((v) => !v);
  };

  const handleItemClick = (item) => {
    setActiveTab(item?.NodeTypeID);
    //! API call.
    provideNodes(item?.NodeTypeID, item);
  };

  const handleClickAll = () => {
    setActiveTab(DEFAULT_TAB);
    const nodeTypeIds = relatedNodes?.NodeTypes?.map(
      (nodeType) => nodeType?.NodeTypeID
    ).join('|');
    provideNodes(nodeTypeIds, { NodeTypeID: DEFAULT_TAB });
  };

  return (
    <div>
      <Styled.TabsContainer>
        <TabItem
          item={{ NodeType: 'همه قالب ها', Count: allNodesCount }}
          isActive={activeTab === DEFAULT_TAB}
          noImage
          onTabClick={handleClickAll}
        />
        {sortedNodes?.map((item, index) => {
          if (index > 2) return null;
          return (
            <TabItem
              item={item}
              key={item?.NodeTypeID}
              isActive={activeTab === item?.NodeTypeID}
              onTabClick={() => handleItemClick(item)}
            />
          );
        })}
        {!!moreNodesCount && (
          <TabItem
            item={{ NodeType: RVDic.ShowAll, Count: moreNodesCount }}
            isActive={isMoreShown}
            hasMore
            onTabClick={handleMoreTopics}
          />
        )}
      </Styled.TabsContainer>
      {/* <PerfectScrollbar  style={{ maxHeight: '10.4rem'}}> */}
      <Styled.MoreTopicsContainer isOpen={isMoreShown}>
        {sortedNodes?.map((item, index) => {
          if (index < 3) return null;
          return (
            <TabItem
              item={item}
              key={item?.NodeTypeID}
              isActive={activeTab === item?.NodeTypeID}
              onTabClick={() => handleItemClick(item)}
            />
          );
        })}
      </Styled.MoreTopicsContainer>
      {/* </PerfectScrollbar> */}
    </div>
  );
};

export default LastTopicsTabs;
