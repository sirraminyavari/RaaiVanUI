import { Link } from 'react-router-dom';
import { TCV_DEFAULT } from 'constant/CssVariables';
import * as Styled from 'views/Node/nodeDetails/NodeDetails.style';
import Avatar from 'components/Avatar/Avatar';
import { getURL } from 'helpers/helpers';

const LogItem = (props) => {
  const { icon: Icon, title, date, user } = props;
  const profilePath = getURL('User', { UserID: user?.UserID });

  return (
    <Styled.LogItemContainer>
      <Styled.LogWrapper start>
        {!!Icon ? <Icon color={TCV_DEFAULT} /> : <Styled.Line />}
        <Styled.LogItemTitle>{title}</Styled.LogItemTitle>
      </Styled.LogWrapper>
      <Styled.LogWrapper end>
        <Styled.LogItemRecordDate>{date}</Styled.LogItemRecordDate>
        <Link to={profilePath} style={{ display: 'contents' }}>
          <Avatar
            className="log-item-avatar"
            userImage={user?.ProfileImageURL}
          />
        </Link>
      </Styled.LogWrapper>
    </Styled.LogItemContainer>
  );
};

export default LogItem;
