import APIHandler from 'apiHelper/APIHandler';
import SimpleListViewer from 'components/SimpleListViewer/SimpleListViewer';
import SubjectItem from 'components/SubjectItem/screen/SubjectItem';
import { encode } from 'js-base64';
import React, { useEffect, useState } from 'react';

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
const NodeList = ({
  searchText,
  dateFilter,
  nodeTypeId,
  formFilters,
  forceFetch,
  onTotalFound,
}) => {
  // to refresh the list value by changing the data, its value will change
  const [extraData, setExtraData] = useState(false);

  // Changes 'extraData' by changes in the searchText, dateFilter, nodeTypeId, formFilters values.
  useEffect(() => {
    onTotalFound(null);
    setExtraData(!extraData);
  }, [searchText, dateFilter, nodeTypeId, formFilters, forceFetch]);

  // method for fetchin nodes
  const fetchData = (count = 20, lowerBoundary = 1, done) => {
    console.log(nodeTypeId, 'nodeTypes****#$%');
    if (nodeTypeId) {
      getNodesAPI.fetch(
        {
          Count: count,
          LowerBoundary: lowerBoundary,
          NodeTypeID: nodeTypeId,
          SearchText: encode(searchText),
          CreationDateFrom: dateFilter?.from,
          CreationDateTo: dateFilter?.to,
          FormFilters: encode(JSON.stringify(formFilters)),
        },
        (response) => {
          if (response.Nodes) {
            // setDataCount(response.TotalCount);

            const nodeIds = response.Nodes.map((x) => x.NodeID);
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
                const complementeryNodes = response.Nodes.map((x) => {
                  const foundedNode = restInfo.find(
                    (y) => y.NodeID === x.NodeID
                  );
                  return {
                    ...x,
                    ...foundedNode,
                  };
                });
                if (done) {
                  done(complementeryNodes, response.TotalCount, nodeTypeId);
                }
              },
              (error) => {
                console.log(error, 'response');
              }
            );
          }
        },
        (error) => console.log('error', error)
      );
    }
  };

  // const route = useCheckRoute('0033c52b-9871-4197-9b7d-ab45203cb4ee');

  const onClick = (nodeId) => {
    // objectUrl({ NodeID: nodeId });
    console.log(RVAPI.NodePageURL({ NodeID: nodeId }), 'node Id ');
    RVAPI.NodePageURL({ NodeID: nodeId });
  };
  const onReload = () => {
    setExtraData(!extraData);
  };
  return (
    <>
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
                onChecked={(value, item) =>
                  console.log(value, item, 'onChecked')
                }
                parentNodeType={nodeTypeId}
                selectMode={false}
                item={x}
                isSaas={isSaas}
                onClick={() => onClick(x.NodeID)}
                onReload={onReload}
              />
            )}
          </>
        )}
      />
      {/* {nodes.length > 0 &&
        nodes.map((x) => (
          <SubjectItem
            onChecked={(value, item) => console.log(value, item, 'onChecked')}
            selectMode={false}
            item={x}
            isSaas={true}
          />
        ))} */}
    </>
  );
};
export default NodeList;
