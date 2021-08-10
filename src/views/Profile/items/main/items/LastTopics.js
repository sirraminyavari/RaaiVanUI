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
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import { USER_MORE_RELATED_TOPICS_PATH } from 'constant/constants';

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

const LastRelatedTopics = ({ relatedNodes, user, isAuthUser }) => {
  const { NodeTypes } = relatedNodes;
  const [nodes, setNodes] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const relatedTopicsLink = `${USER_MORE_RELATED_TOPICS_PATH}${
    isAuthUser ? '' : `/${user.UserID}`
  }`;

  const firstFive = (node, index) => index < SHOW_NODES_COUNT;
  const firstFiveNodes = nodes?.filter(firstFive);

  const provideNodes = (nodeTypeIds) => {
    setIsFetching(true);
    getNodes(nodeTypeIds)
      .then((response) => {
        // console.log(response);
        if (!!response?.Nodes && !!response?.Nodes.length) {
          const nodeIds = response?.Nodes.map((node) => node?.NodeID).join('|');
          getNodeInfo(nodeIds)
            .then((restInfo) => {
              setIsFetching(false);
              const complementeryNodes = response?.Nodes.map((x) => {
                const foundedNode = restInfo?.find(
                  (y) => y.NodeID === x.NodeID
                );
                return {
                  ...x,
                  ...foundedNode,
                };
              });
              setNodes(complementeryNodes);
              console.log(complementeryNodes);
            })
            .catch((err) => {
              setIsFetching(false);
              console.log(err);
            });
        }
      })
      .catch((err) => {
        setIsFetching(false);
        console.log(err);
      });
  };

  useEffect(() => {
    if (!NodeTypes) return;
    const nodeTypeIds = NodeTypes?.map((nodeType) => nodeType?.NodeTypeID).join(
      '|'
    );
    provideNodes(nodeTypeIds);
  }, [NodeTypes]);

  return (
    <Styled.LastTopicsContainer>
      <Styled.Header>
        <Styled.Title>آخرین موضوعات مرتبط با من</Styled.Title>
        <Button classes="see-all-button">
          <Link to={relatedTopicsLink} style={{ color: TCV_DEFAULT }}>
            مشاهده همه
          </Link>
        </Button>
      </Styled.Header>
      <LastTopicTabs relatedNodes={relatedNodes} provideNodes={provideNodes} />
      {isFetching ? (
        <LogoLoader />
      ) : (
        <>
          {firstFiveNodes?.map((item) => {
            return <TopicItem key={item.NodeID} item={item} />;
          })}
          {!NodeTypes?.length && <EmptyState />}
        </>
      )}
    </Styled.LastTopicsContainer>
  );
};

export default LastRelatedTopics;
