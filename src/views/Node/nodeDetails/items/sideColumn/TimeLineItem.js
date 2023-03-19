/**
 * Reders history log item for time line.
 */
import { Link } from 'react-router-dom';
import * as Styled from 'views/Node/nodeDetails/NodeDetails.style';
import Avatar from 'components/Avatar/Avatar';

const TimeLineItem = ({ isLast }) => {
  return (
    <Styled.TimeLineItemContainer isLast={isLast}>
      <Link to="/user">
        <Avatar
          style={{ width: '3rem', height: '3rem' }}
          className="log-item-avatar"
          userImage={'https://i.pravatar.cc/300'}
        />
      </Link>
      <div>
        <Styled.TimeLineTitle>تغییر در دانشنامه</Styled.TimeLineTitle>
        <Styled.TimeLineDate>1400/05/29 17:09</Styled.TimeLineDate>
      </div>
    </Styled.TimeLineItemContainer>
  );
};

export default TimeLineItem;
