import { Link } from 'react-router-dom';
import * as Styled from './NodeCell.styles';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import OpenMailIcon from 'components/Icons/MailIcon/OpenMailIcon';
import { CV_DISTANT } from 'constant/CssVariables';
import { decodeBase64, getURL } from 'helpers/helpers';

const NodeCell = (props) => {
  const { nodeInfo, cell } = props?.value || {};

  return (
    <Styled.NodesWrapper>
      {nodeInfo?.NodeTypes.map((node, index) => (
        <Styled.NodeCellContainer key={node?.NodeTypeID || index}>
          <Styled.NodeInfoWrapper editable={props?.header?.options?.editable}>
            <OpenMailIcon color={CV_DISTANT} size={25} />
            <Styled.NodeLinkWrapper>
              <Link to={getURL('Classes', { NodeTypeID: node?.NodeTypeID })}>
                {decodeBase64(node?.NodeType)}
              </Link>
            </Styled.NodeLinkWrapper>
          </Styled.NodeInfoWrapper>
          <Styled.CloseIconWrapper>
            <CloseIcon color={CV_DISTANT} />
          </Styled.CloseIconWrapper>
        </Styled.NodeCellContainer>
      ))}
    </Styled.NodesWrapper>
  );
};

export default NodeCell;
