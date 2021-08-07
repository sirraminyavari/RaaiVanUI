import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Styled from 'views/Profile/Profile.styles';
import Button from 'components/Buttons/Button';
import { TCV_DEFAULT } from 'constant/CssVariables';
import LastTopicTabs from './LastTopicsTabs';
// import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import TopicItem from './TopicItem';
import { API_Provider } from 'helpers/helpers';
import { CN_API, GET_NODES, GET_NODE_INFO } from 'constant/apiConstants';
import EmptyState from 'components/EmptyState/EmptyState';

const getNodesAPI = API_Provider(CN_API, GET_NODES);
const getNodeInfoAPI = API_Provider(CN_API, GET_NODE_INFO);
const SHOW_NODES_COUNT = 5;

const getNodes = (nodeTypeIds = '', nodeTypeId = '', relatedToId = '') => {
  return new Promise((resolve, reject) => {
    try {
      getNodesAPI.fetch(
        {
          NodeTypeID: nodeTypeId,
          NodeTypeIDs: nodeTypeIds,
          RelatedToNodeID: relatedToId,
        },
        (response) => {
          resolve(response);
        },
        (err) => reject(err)
      );
    } catch (error) {
      reject(error);
    }
  });
};

const getNodeInfo = (nodeIds = '') => {
  return new Promise((resolve, reject) => {
    try {
      getNodeInfoAPI.fetch(
        {
          NodeIDs: nodeIds,
          Description: true,
          Creator: true,
          LikesCount: true,
          VisitsCount: true,
          ParseResults: true,
          LikeStatus: true,
        },
        (response) => {
          resolve(response);
        },
        (err) => reject(err)
      );
    } catch (error) {
      reject(error);
    }
  });
};

const LastRelatedTopics = ({ relatedNodes }) => {
  const { NodeTypes } = relatedNodes;
  const [nodes, setNodes] = useState([]);

  const firstFive = (node, index) => index < SHOW_NODES_COUNT;
  const firstFiveNodes = nodes?.filter(firstFive);

  useEffect(() => {
    if (!NodeTypes) return;
    const nodeTypeIds = NodeTypes?.map((nodeType) => nodeType?.NodeTypeID).join(
      '|'
    );
    getNodes(nodeTypeIds)
      .then((response) => {
        // console.log(response);
        if (!!response?.Nodes && !!response?.Nodes.length) {
          const nodeIds = response?.Nodes.map((node) => node?.NodeID).join('|');
          getNodeInfo(nodeIds)
            .then((response) => {
              setNodes(response);
              console.log(response);
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }, [NodeTypes]);

  return (
    <Styled.LastTopicsContainer>
      <Styled.Header>
        <Styled.Title>آخرین موضوعات مرتبط با من</Styled.Title>
        <Button classes="see-all-button">
          <Link to="#" style={{ color: TCV_DEFAULT }}>
            مشاهده همه
          </Link>
        </Button>
      </Styled.Header>
      <LastTopicTabs relatedNodes={relatedNodes} />
      {firstFiveNodes?.map((item) => {
        return <TopicItem key={item.NodeID} item={item} />;
      })}
      {!NodeTypes?.length && <EmptyState />}
    </Styled.LastTopicsContainer>
  );
};

export default LastRelatedTopics;
