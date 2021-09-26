import * as Styled from 'views/Node/nodeDetails/NodeDetails.style';
import Avatar from 'components/Avatar/Avatar';

const TimeLineItem = ({ isLast }) => {
  return (
    <Styled.TimeLineItemContainer isLast={isLast}>
      <Avatar
        className="log-item-avatar"
        userImage={'https://i.pravatar.cc/300'}
      />
      <div>
        <Styled.TimeLineTitle>تغییر در دانشنامه</Styled.TimeLineTitle>
        <Styled.TimeLineDate>1400/05/29 17:09</Styled.TimeLineDate>
      </div>
    </Styled.TimeLineItemContainer>
  );
};

export default TimeLineItem;
