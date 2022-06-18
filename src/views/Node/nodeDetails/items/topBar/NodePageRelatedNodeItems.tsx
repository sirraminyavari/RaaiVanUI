/**
 * here we make the top bar for NodeDetails
 */
import APIHandler from 'apiHelper/APIHandler';
import useWindow from 'hooks/useWindowContext';
import React, { useEffect, useState } from 'react';
import LastTopicsTabs from 'views/Profile/items/main/items/LastTopicsTabs';
import * as Styles from './TopBar.style';

export type INodePageRelatedNodeItems = {
  onApplyNodeType: () => void;
};

const getNodeInfoAPI = new APIHandler('CNAPI', 'GetRelatedNodesAbstract');

const NodePageRelatedNodeItems = ({ onApplyNodeType = () => {} }) => {
  const [relatedNodes, setRelatedNodes] = useState<
    | {
        AppID: string;
        NodeTypes: any[];
        RelatedNodeTypesCount: number;
        TotalRelationsCount: number;
      }
    | undefined
  >();
  const { RVDic, RVGlobal } = useWindow();

  const getRelatedNodes = () => {
    getNodeInfoAPI.fetch(
      {
        NodeID: RVGlobal?.CurrentUser?.UserID,
        In: true,
        Out: true,
        InTags: true,
        OutTags: true,
        ParseResults: true,
      },
      (response) => {
        if (response && response.NodeTypes) {
          setRelatedNodes(response);
        }
      }
    );
  };

  useEffect(() => {
    getRelatedNodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {relatedNodes && relatedNodes.TotalRelationsCount > 0 && (
        <Styles.NodeTopBarRelatedTopicsContainer>
          <Styles.NodeTopBarRelatedTopicsTitle>
            {RVDic.RelatedNode}
          </Styles.NodeTopBarRelatedTopicsTitle>
          <LastTopicsTabs
            noAllTemplateButton
            floatBox
            provideNodes={onApplyNodeType}
            relatedNodes={relatedNodes}
            showAll={undefined}
            relatedTopicsLink={undefined}
          />
        </Styles.NodeTopBarRelatedTopicsContainer>
      )}
    </>
  );
};
export default NodePageRelatedNodeItems;
