import React, { useEffect, useState } from 'react';
import APIHandler from 'apiHelper/APIHandler';
import useCheckRoute from 'hooks/useCheckRoute';
import SubjectItem from 'components/SubjectItem/screen/SubjectItem';
import { MdDone } from 'react-icons/md';
import SimpleListViewer from 'components/SimpleListViewer/SimpleListViewer';
import { data } from 'jquery';
import { encode } from 'js-base64';

const getNodesAPI = new APIHandler('CNAPI', 'GetNodes');
const getNodeInfoAPI = new APIHandler('CNAPI', 'GetNodeInfo');

const { GlobalUtilities } = window;

const NodeList = ({ searchText, dateFilter }) => {
  const [nodes, setNodes] = useState([]);
  const [dataCount, setDataCount] = useState(0);
  const fetchData = (count = 20, lowerBoundary = 0, done) => {
    console.log(dateFilter, 'dateFilter ');

    getNodesAPI.fetch(
      {
        Count: count,
        LowerBoundary: lowerBoundary,
        NodeTypeId: '0033c52b-9871-4197-9b7d-ab45203cb4ee',
        SearchText: encode(searchText),
        CreationDateFrom: dateFilter?.from,
        CreationDateTo: dateFilter?.to,
      },
      (response) => {
        console.log(response, 'response');

        if (response.Nodes) {
          // setDataCount(response.TotalCount);
          const nodeIds = response.Nodes.map((x) => x.NodeID);
          nodeIds.join('|');
          console.log(nodeIds.join('|'), 'nodeIds');

          getNodeInfoAPI.fetch(
            {
              NodeIDs: nodeIds.join('|'),
              Description: true,
              Creator: true,
              LikesCount: true,
              VisitsCount: true,
              ParseResults: true,
            },
            (restInfo) => {
              const complementeryNodes = response.Nodes.map((x) => {
                const foundedNode = restInfo.find((y) => y.NodeID === x.NodeID);
                return {
                  ...x,
                  ...foundedNode,
                };
              });
              if (done) {
                done(complementeryNodes, response.TotalCount);
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
  };

  // const route = useCheckRoute('0033c52b-9871-4197-9b7d-ab45203cb4ee');

  return (
    <>
      <SimpleListViewer
        fetchMethod={fetchData}
        extraData={[searchText, dateFilter]}
        infiniteLoop={true}
        onEndReached={() => {
          console.log('Im reached end');
        }}
        renderItem={(x) => (
          <SubjectItem
            onChecked={(value, item) => console.log(value, item, 'onChecked')}
            selectMode={false}
            item={x}
            isSaas={true}
          />
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
