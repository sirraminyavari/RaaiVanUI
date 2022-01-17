import APIHandler from 'apiHelper/APIHandler';
import SimpleListViewer from 'components/SimpleListViewer/SimpleListViewer';
import SubjectItem from 'components/SubjectItem/screen/SubjectItem';
import usePrevious from 'hooks/usePrevious';
import { encode } from 'js-base64';
import { func } from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useTraceUpdate from 'utils/TraceHelper/traceHelper';
import IntroNodes from './IntroNodes';

const getNodesAPI = new APIHandler('CNAPI', 'GetNodes');

const getNodeInfoAPI = new APIHandler('CNAPI', 'GetNodeInfo');
const isSaas = (window.RVGlobal || {}).SAASBasedMultiTenancy;
const { RVAPI } = window;

/**
 *
 * @param {String} searchText - a string for searching in the nodes title
 * @param {Object} dateFilter - selected date for finding nodes in that period time
 * @param {String} nodeTypeId - Id of nodeType.
 * @param {Object} formFilters - object of objects of filters
 * @returns
 */
const NodeList = (props) => {
  const {
    searchText,
    dateFilter,
    nodeTypeId,
    formFilters,
    forceFetch,
    onTotalFound,
    isByMe,
    isGroup,
    isExpertiseDomain,
    byPeople,
    isBookMarked,
    multiSelection,
    onCheck,
    itemSelectionMode,
    nodeTypeIds,
    relatedToNodeId,
    onFetchCounts,
    onClickItem,
    selectedFilters,
  } = props || {};
  useTraceUpdate(props);

  // to refresh the list value by changing the data, its value will change
  const [extraData, setExtraData] = useState(false);

  const [bookmarkedList, setBookmarkedList] = useState([]);
  // useTraceUpdate(props);

  const { onboardingName } = useSelector((state) => ({
    onboardingName: state.onboarding.name,
  }));

  const preExtraData = usePrevious(extraData);
  const preIsBookMarked = usePrevious(isBookMarked);

  // Changes 'extraData' by changes in the searchText, dateFilter, nodeTypeId, formFilters values.
  useEffect(() => {
    onTotalFound(null);
    // console.log(isBookMarked, 'isBookMarked', bookmarked, 'bookmarked');
    setExtraData(!extraData);
  }, [
    isByMe,
    byPeople,
    searchText,
    dateFilter,
    nodeTypeId,
    nodeTypeIds,
    formFilters,
    forceFetch,
    isBookMarked,
    isGroup,
    isExpertiseDomain,
    relatedToNodeId,
  ]);

  // method for fetchin nodes
  const fetchData = (count = 20, lowerBoundary = 1, done) => {
    getNodesAPI.fetch(
      {
        Count: count,
        LowerBoundary: lowerBoundary,
        NodeTypeID: nodeTypeId || nodeTypeIds,
        RelatedToNodeID: relatedToNodeId,
        SearchText: encode(searchText),
        CreationDateFrom: dateFilter?.from,
        CreationDateTo: dateFilter?.to,
        FormFilters: encode(JSON.stringify(formFilters)),
        UseNodeTypeHierarchy: true,
        IsMine: isByMe,
        // CreatorUserID: byPeople?.id,
        IsGroup: isGroup,
        IsExpertiseDomain: isExpertiseDomain,
        FetchCounts: true,
        CreatorUserIDs: byPeople?.map((x) => x.id),

        VisitsCount: true,
        IsFavorite: isBookMarked,
      },
      (response) => {
        if (response.Nodes) {
          console.log(response, '####### response ########');
          // setDataCount(response.TotalCount);
          if (!!onFetchCounts) {
            const { Count } = response || {};
            onFetchCounts(Count);
          }

          const nodeIds = response?.Nodes.map((x) => x?.NodeID);
          nodeIds.join('|');
          // method for fetching the  complementary info about each node
          getNodeInfoAPI.fetch(
            {
              NodeIDs: nodeIds.join('|'),
              Description: !isSaas,
              Creator: true,
              LikesCount: !isSaas,
              VisitsCount: !isSaas,
              ParseResults: true,
              LikeStatus: true,
            },
            (restInfo) => {
              const complementeryNodes = response?.Nodes.map((x) => {
                const foundedNode = restInfo?.find(
                  (y) => y.NodeID === x.NodeID
                );
                return {
                  ...x,
                  ...foundedNode,
                };
              });
              if (done) {
                done(complementeryNodes, response.TotalCount, nodeTypeId);
                setBookmarkedList(
                  complementeryNodes
                    ?.filter((x) => x.LikeStatus)
                    ?.map((y) => y.NodeID)
                );
              }
            },
            (error) => {}
          );
        }
      },
      (error) => console.log('error', error)
    );
  };

  const onReload = () => {
    setExtraData(!extraData);
  };
  const onBookmark = (nodeId) => {
    // const nodeIndex = bookmarkedList.findIndex((y) => y === nodeId);
    const nodeIndex = bookmarkedList.indexOf(nodeId);

    if (nodeIndex > -1) {
      let tempList = bookmarkedList;

      tempList = tempList.filter((item) => item !== nodeId);

      setBookmarkedList(tempList);
    } else {
      setBookmarkedList([...bookmarkedList, nodeId]);
    }
  };

  return (
    <>
      {onboardingName !== 'intro' ? (
        <SimpleListViewer
          fetchMethod={fetchData}
          extraData={extraData}
          infiniteLoop={true}
          onEndReached={() => {
            console.log('Im reached end');
          }}
          onTotal={onTotalFound}
          renderItem={(x, index) => (
            <>
              {x.Creator && (
                <SubjectItem
                  key={index}
                  onChecked={(value, item) => onCheck && onCheck(value, item)}
                  parentNodeType={nodeTypeId}
                  selectMode={multiSelection}
                  liteMode={itemSelectionMode}
                  item={{
                    ...x,
                    LikeStatus: bookmarkedList.find((y) => y === x?.NodeID),
                  }}
                  isSaas={isSaas}
                  onReload={onReload}
                  onBookmark={onBookmark}
                  onClickItem={onClickItem}
                />
              )}
            </>
          )}
        />
      ) : (
        <IntroNodes
          onChecked={(value, item) => onCheck && onCheck(value, item)}
          selectMode={multiSelection}
          liteMode={itemSelectionMode}
        />
      )}
    </>
  );
};
export default NodeList;
