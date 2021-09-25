import { TCV_DEFAULT } from 'constant/CssVariables';
import * as Styled from 'views/Node/nodeDetails/NodeDetails.style';
import Avatar from 'components/Avatar/Avatar';

const LogItem = (props) => {
  const { icon: Icon, title, logData } = props;

  return (
    <Styled.LogItemContainer>
      <Styled.LogWrapper start>
        {!!Icon ? <Icon color={TCV_DEFAULT} size={22} /> : <Styled.Line />}
        <Styled.LogItemTitle>{title}</Styled.LogItemTitle>
      </Styled.LogWrapper>
      <Styled.LogWrapper end>
        <Styled.LogItemRecordDate>
          {logData?.RecordDate || '1399/09/20 16:52'}
        </Styled.LogItemRecordDate>
        <Avatar
          className="log-item-avatar"
          userImage={'https://i.pravatar.cc/300'}
        />
      </Styled.LogWrapper>
    </Styled.LogItemContainer>
  );
};

export default LogItem;
