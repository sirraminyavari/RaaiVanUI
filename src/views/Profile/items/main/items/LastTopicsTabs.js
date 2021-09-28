import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as Styled from 'views/Profile/Profile.styles';
import TabItem from './TabItem';
// import useWindow from 'hooks/useWindowContext';
import Button from 'components/Buttons/Button';
import { USER_MORE_RELATED_TOPICS_PATH } from 'constant/constants';
// import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';

const DEFAULT_TAB = 'all-classes';
// const MORE_TAB = 'more-classes';

const LastTopicsTabs = (props) => {
  const { relatedNodes, provideNodes, showAll, relatedTopicsLink } = props;
  const [isMoreShown, setIsMoreShown] = useState(false);
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB);
  // const { RVDic } = useWindow();
  const location = useLocation();

  const isRelatedPage = location.pathname.includes(
    USER_MORE_RELATED_TOPICS_PATH
  );

  useEffect(() => {
    if (relatedNodes) {
      const nodeTypeIds = relatedNodes?.NodeTypes?.map(
        (nodeType) => nodeType?.NodeTypeID
      ).join('|');
      provideNodes(nodeTypeIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (!!showAll) {
      setActiveTab(DEFAULT_TAB);
      const nodeTypeIds = relatedNodes?.NodeTypes?.map(
        (nodeType) => nodeType?.NodeTypeID
      ).join('|');

      provideNodes(nodeTypeIds, { NodeTypeID: DEFAULT_TAB });
    }
  };

  return (
    <div>
      <Styled.TabsContainer>
        {!!showAll && (
          <TabItem
            item={{ NodeType: 'همه قالب ها', Count: allNodesCount }}
            isActive={activeTab === DEFAULT_TAB}
            noImage
            onTabClick={handleClickAll}
          />
        )}
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
            item={{ NodeType: 'سایر آیتم‌ها', Count: moreNodesCount }}
            isActive={isMoreShown}
            noImage
            hasMore
            onTabClick={handleMoreTopics}
          />
        )}
      </Styled.TabsContainer>
      <Styled.MoreTopicsContainer isOpen={isMoreShown}>
        <Styled.MoreTopicsWrapper>
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
        </Styled.MoreTopicsWrapper>
        {!isRelatedPage && (
          <Button classes="more-topics-button">
            <Link to={relatedTopicsLink}>مشاهده همه آیتم‌ها</Link>
          </Button>
        )}
      </Styled.MoreTopicsContainer>
    </div>
  );
};

export default LastTopicsTabs;
