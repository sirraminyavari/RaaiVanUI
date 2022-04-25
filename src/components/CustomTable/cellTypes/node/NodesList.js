import { Link } from 'react-router-dom';
import * as Styled from './NodeCell.styles';
import { decodeBase64, getURL } from 'helpers/helpers';
import OpenMailIcon from 'components/Icons/MailIcon/OpenMailIcon';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import { CV_DISTANT } from 'constant/CssVariables';

const NodesList = (props) => {
  const { nodes, canEdit, onRemoveNode } = props;

  const handleRemoveNode = (node) => {
    onRemoveNode && onRemoveNode(node);
  };

  const handleViewNode = (nodeId) => {
    let url = getURL('Node', { NodeID: nodeId });
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  return (
    <Styled.NodesListWrapper>
      {nodes?.map((node, index) => {
        const { NodeID, Name } = node || {};
        return (
          <Styled.NodeItemContainer key={NodeID || index}>
            <Styled.NodeInfoWrapper
              onClick={(e) => {
                if (!canEdit) return;
                e.stopPropagation();
                handleViewNode(NodeID);
              }}
              editable={canEdit}
            >
              <OpenMailIcon color={CV_DISTANT} size={25} />
              <Styled.NodeLinkHeading className="table-node-view" type="h6">
                {decodeBase64(Name)}
              </Styled.NodeLinkHeading>
            </Styled.NodeInfoWrapper>
            {canEdit && (
              <Styled.CloseIconWrapper onClick={() => handleRemoveNode(node)}>
                <CloseIcon color={CV_DISTANT} />
              </Styled.CloseIconWrapper>
            )}
          </Styled.NodeItemContainer>
        );
      })}
    </Styled.NodesListWrapper>
  );
};

export default NodesList;
