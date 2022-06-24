import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as Styled from 'components/RelatedTopicsTab/RelatedTopicsTab.style';
import RelatedTopicsTabItem from './RelatedTopicsTabItem';
import Button from 'components/Buttons/Button';
import { USER_MORE_RELATED_TOPICS_PATH } from 'constant/constants';

const DEFAULT_TAB = 'all-classes';

export type IRelatedTopicsTab = {
  relatedNodes?: { [key: string]: any };
  provideNodes?: (NodesString: string) => void;
  itemOnClick?: (Node: { [key: string]: any; NodeTypeID: string }) => void;
  showAll?: boolean;
  relatedTopicsLink?: string;
  floatBox?: boolean;
  defaultChecked?: boolean;
  noAllTemplateButton?: boolean;
};

const RelatedTopicsTab = ({
  relatedNodes,
  provideNodes,
  itemOnClick,
  showAll,
  relatedTopicsLink,
  floatBox,
  defaultChecked = false,
  noAllTemplateButton = false,
}: IRelatedTopicsTab = {}) => {
  const getAllNodeTypeIds = () =>
    showAll
      ? []
      : relatedNodes?.NodeTypes?.map((nodeType) => nodeType?.NodeTypeID);

  const [isMoreShown, setIsMoreShown] = useState(false);
  const [activeTab, setActiveTab] = useState(
    defaultChecked ? DEFAULT_TAB : undefined
  );
  const [nodeTypeIds, setNodeTypeIds] = useState(getAllNodeTypeIds());

  const location = useLocation();

  const isRelatedPage = location.pathname.includes(
    USER_MORE_RELATED_TOPICS_PATH
  );

  useEffect(() => {
    if (activeTab === DEFAULT_TAB) setNodeTypeIds(getAllNodeTypeIds());
  }, [relatedNodes]);

  useEffect(
    () => provideNodes && provideNodes((nodeTypeIds || []).join('|')),
    [nodeTypeIds]
  );

  const allNodesCount = relatedNodes?.NodeTypes?.reduce(
    (acc, prev) => acc + prev?.Count,
    0
  );

  const sortedNodes = relatedNodes?.NodeTypes?.sort(
    (a, b) => b.Count - a.Count
  );

  const moreNodesCount = sortedNodes
    ?.filter((_node, index) => {
      if (index <= 1) return false;
      return true;
    })
    ?.reduce((acc, prev) => acc + prev?.Count, 0);

  const handleMoreTopics = () => {
    setIsMoreShown((v) => !v);
  };

  const handleItemClick = (item) => {
    itemOnClick && itemOnClick(item);
    setActiveTab(item?.NodeTypeID);
    setNodeTypeIds([item?.NodeTypeID]);
  };

  const handleClickAll = () => {
    setActiveTab(DEFAULT_TAB);
    setNodeTypeIds(getAllNodeTypeIds());
  };

  return (
    <Styled.RelatedTopicsTabContainer>
      <Styled.RelatedTopicsTabInnerContainer>
        {!noAllTemplateButton && (
          <RelatedTopicsTabItem
            item={{ NodeType: 'همه قالب ها', Count: allNodesCount }}
            isActive={activeTab === DEFAULT_TAB}
            noImage
            onTabClick={handleClickAll}
          />
        )}
        {sortedNodes
          ?.filter((itm, ind) => ind <= 1)
          .map((item) => (
            <RelatedTopicsTabItem
              item={item}
              key={item?.NodeTypeID}
              isActive={activeTab === item?.NodeTypeID}
              onTabClick={() => handleItemClick(item)}
            />
          ))}
        {!!moreNodesCount && (
          <RelatedTopicsTabItem
            item={{ NodeType: 'سایر آیتم‌ها', Count: moreNodesCount }}
            isActive={isMoreShown}
            noImage
            hasMore
            onTabClick={handleMoreTopics}
          />
        )}
      </Styled.RelatedTopicsTabInnerContainer>
      <Styled.RelatedTopicsTabMoreTopicsContainer
        isOpen={isMoreShown}
        isFloat={!!floatBox}
      >
        <Styled.RelatedTopicsTabMoreTopicsWrapper>
          {sortedNodes
            ?.filter((itm, ind) => ind > 1)
            .map((item) => (
              <RelatedTopicsTabItem
                item={item}
                key={item?.NodeTypeID}
                isActive={activeTab === item?.NodeTypeID}
                onTabClick={() => handleItemClick(item)}
              />
            ))}
        </Styled.RelatedTopicsTabMoreTopicsWrapper>
        {!isRelatedPage && (
          <Button classes="more-topics-button" style={{ maxWidth: '12rem' }}>
            <Link to={relatedTopicsLink || ''}>مشاهده همه آیتم‌ها</Link>
          </Button>
        )}
      </Styled.RelatedTopicsTabMoreTopicsContainer>
    </Styled.RelatedTopicsTabContainer>
  );
};

export default RelatedTopicsTab;
