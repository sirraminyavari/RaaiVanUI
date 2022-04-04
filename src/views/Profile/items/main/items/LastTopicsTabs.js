import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as Styled from 'views/Profile/Profile.styles';
import TabItem from './TabItem';
import Button from 'components/Buttons/Button';
import { USER_MORE_RELATED_TOPICS_PATH } from 'constant/constants';
import ScrollBarProvider from 'components/ScrollBarProvider/ScrollBarProvider';

const DEFAULT_TAB = 'all-classes';

const LastTopicsTabs = ({
  relatedNodes,
  provideNodes,
  showAll,
  relatedTopicsLink,
  floatBox,
} = {}) => {
  const getAllNodeTypeIds = () =>
    showAll
      ? []
      : relatedNodes?.NodeTypes?.map((nodeType) => nodeType?.NodeTypeID);

  const [isMoreShown, setIsMoreShown] = useState(false);
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB);
  const [nodeTypeIds, setNodeTypeIds] = useState(getAllNodeTypeIds());

  const location = useLocation();

  const isRelatedPage = location.pathname.includes(
    USER_MORE_RELATED_TOPICS_PATH
  );

  useEffect(() => {
    if (activeTab === DEFAULT_TAB) setNodeTypeIds(getAllNodeTypeIds());
  }, [relatedNodes]);

  useEffect(() => provideNodes((nodeTypeIds || []).join('|')), [nodeTypeIds]);

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

  const handleMoreTopics = () => {
    setIsMoreShown((v) => !v);
  };

  const handleItemClick = (item) => {
    setActiveTab(item?.NodeTypeID);
    setNodeTypeIds([item?.NodeTypeID]);
  };

  const handleClickAll = () => {
    setActiveTab(DEFAULT_TAB);
    setNodeTypeIds(getAllNodeTypeIds());
  };

  return (
    <ScrollBarProvider style={{ paddingBottom: '0.5rem', width: '100%' }}>
      <Styled.TopicsTabsContainer>
        <Styled.TabsContainer>
          <TabItem
            item={{ NodeType: 'همه قالب ها', Count: allNodesCount }}
            isActive={activeTab === DEFAULT_TAB}
            noImage
            onTabClick={handleClickAll}
          />
          {sortedNodes
            ?.filter((itm, ind) => ind <= 2)
            .map((item, index) => (
              <TabItem
                item={item}
                key={item?.NodeTypeID}
                isActive={activeTab === item?.NodeTypeID}
                onTabClick={() => handleItemClick(item)}
              />
            ))}
          {!!moreNodesCount && (
            <TabItem
              item={{ NodeType: 'سایر آیتم‌ها', Count: moreNodesCount }}
              isActive={isMoreShown}
              noImage
              hasMore
              onTabClick={handleMoreTopics}
            />
          )}
        </Styled.TabsContainer>
        <Styled.MoreTopicsContainer isOpen={isMoreShown} isFloat={!!floatBox}>
          <Styled.MoreTopicsWrapper>
            {sortedNodes
              ?.filter((itm, ind) => ind >= 3)
              .map((item, index) => (
                <TabItem
                  item={item}
                  key={item?.NodeTypeID}
                  isActive={activeTab === item?.NodeTypeID}
                  onTabClick={() => handleItemClick(item)}
                />
              ))}
          </Styled.MoreTopicsWrapper>
          {!isRelatedPage && (
            <Button classes="more-topics-button">
              <Link to={relatedTopicsLink || ''}>مشاهده همه آیتم‌ها</Link>
            </Button>
          )}
        </Styled.MoreTopicsContainer>
      </Styled.TopicsTabsContainer>
    </ScrollBarProvider>
  );
};

export default LastTopicsTabs;
