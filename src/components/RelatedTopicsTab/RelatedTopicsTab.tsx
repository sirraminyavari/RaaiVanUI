import { RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  const relatedItemsContainerElement = useRef<HTMLDivElement>();
  const [moreRelatedItemOffset, setMoreRelatedItemOffset] =
    useState<number>(-1);

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

  const calculateOffsetItems = () => {
    setMoreRelatedItemOffset(-1);
    const { width } =
      relatedItemsContainerElement.current!.getBoundingClientRect();
    const RelatedTopicsMoreButtonWidth =
      relatedItemsContainerElement
        .current!.querySelector(`:scope>div#RelatedTopicsMoreButton`)
        ?.getBoundingClientRect()?.width || 0;
    const itemElements = relatedItemsContainerElement.current!.querySelectorAll(
      `:scope>div:not(#RelatedTopicsMoreButton)`
    );

    let availableWidthInContainer = width - RelatedTopicsMoreButtonWidth;
    for (let idx = 0; idx < itemElements.length; idx++) {
      const itemElementWidth = itemElements[idx].getBoundingClientRect().width;
      availableWidthInContainer -= itemElementWidth;
      if (availableWidthInContainer < 0 && idx === 0) {
        setMoreRelatedItemOffset(0);
        break;
      }
      if (availableWidthInContainer < 0) {
        setMoreRelatedItemOffset(idx - 1);
        break;
      }
      if (idx + 1 === (sortedNodes || [])?.length)
        return setMoreRelatedItemOffset(idx);
    }
  };
  useLayoutEffect(() => {
    calculateOffsetItems();
    window.addEventListener('resize', calculateOffsetItems);
    return () => {
      window.removeEventListener('resize', calculateOffsetItems);
    };
  }, []);

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
      <Styled.RelatedTopicsTabInnerContainer
        ref={relatedItemsContainerElement as RefObject<HTMLDivElement>}
      >
        {!noAllTemplateButton && (
          <RelatedTopicsTabItem
            item={{ NodeType: 'همه قالب ها', Count: allNodesCount }}
            isActive={activeTab === DEFAULT_TAB}
            noImage
            onTabClick={handleClickAll}
          />
        )}
        {sortedNodes?.map((item, idx) => (
          <RelatedTopicsTabItem
            item={item}
            key={item?.NodeTypeID}
            isActive={activeTab === item?.NodeTypeID}
            onTabClick={() => handleItemClick(item)}
            visible={
              moreRelatedItemOffset === -1 || idx <= moreRelatedItemOffset
            }
          />
        ))}

        <RelatedTopicsTabItem
          item={{ NodeType: 'سایر آیتم‌ها', Count: moreNodesCount }}
          isActive={isMoreShown}
          noImage
          hasMore
          onTabClick={handleMoreTopics}
          id="RelatedTopicsMoreButton"
          visible={
            moreRelatedItemOffset === -1 ||
            sortedNodes?.length > moreRelatedItemOffset + 1
          }
        />
      </Styled.RelatedTopicsTabInnerContainer>
      <Styled.RelatedTopicsTabMoreTopicsContainer
        isOpen={isMoreShown}
        isFloat={!!floatBox}
      >
        <Styled.RelatedTopicsTabMoreTopicsWrapper>
          {sortedNodes?.map((item, idx) => (
            <RelatedTopicsTabItem
              item={item}
              key={item?.NodeTypeID}
              isActive={activeTab === item?.NodeTypeID}
              onTabClick={() => handleItemClick(item)}
              visible={idx > moreRelatedItemOffset}
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
