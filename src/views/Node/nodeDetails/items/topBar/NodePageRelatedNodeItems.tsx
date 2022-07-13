/**
 * here we make the top bar for NodeDetails
 */
import APIHandler from 'apiHelper/APIHandler';
import { getClassesPageUrl } from 'apiHelper/getPageUrl';
import RelatedTopicsTab from 'components/RelatedTopicsTab/RelatedTopicsTab';
import useWindow from 'hooks/useWindowContext';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import * as Styles from './TopBar.style';

export type INodePageRelatedNodeItems = {
  onApplyNodeType: () => void;
  NodeID: string;
  ClassID: string;
};

const getNodeInfoAPI = new APIHandler('CNAPI', 'GetRelatedNodesAbstract');

const NodePageRelatedNodeItems = ({
  onApplyNodeType = () => {},
  ClassID,
  NodeID,
}) => {
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
  const history = useHistory();

  const getRelatedNodes = () => {
    getNodeInfoAPI.fetch(
      {
        NodeID: NodeID || RVGlobal?.CurrentUser?.UserID,
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

  const onRelatedItemClick = ({ NodeTypeID }) => {
    const classURL = getClassesPageUrl(NodeTypeID, NodeID);
    history.push(classURL);
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
          <RelatedTopicsTab
            noAllTemplateButton
            floatBox
            provideNodes={onApplyNodeType}
            relatedNodes={relatedNodes}
            showAll={true}
            itemOnClick={onRelatedItemClick}
            relatedTopicsLink={getClassesPageUrl(ClassID, NodeID)}
          />
        </Styles.NodeTopBarRelatedTopicsContainer>
      )}
    </>
  );
};
export default NodePageRelatedNodeItems;
