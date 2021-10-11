import { Link } from 'react-router-dom';
import * as Styled from './NodeCell.styles';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import OpenMailIcon from 'components/Icons/MailIcon/OpenMailIcon';
import { CV_DISTANT } from 'constant/CssVariables';

const NodeCell = (props) => {
  return (
    <Styled.NodesWrapper>
      {[1, 2].map((index) => (
        <Styled.NodeCellContainer key={index}>
          <Styled.NodeInfoWrapper editable={props?.header?.options?.editable}>
            <OpenMailIcon color={CV_DISTANT} size={25} />
            <Styled.NodeLinkWrapper>
              <Link to="/home">نامه دستورالعمل ساختار</Link>
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
