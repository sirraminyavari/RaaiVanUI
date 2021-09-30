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
        {!!Icon ? <Icon color={TCV_DEFAULT} size={22} /> : <Styled.Line />}
        <Styled.LogItemTitle>{title}</Styled.LogItemTitle>
      </Styled.LogWrapper>
      <Styled.LogWrapper end>
        <Styled.LogItemRecordDate>
          {date || '16:52 1400/06/03'}
        </Styled.LogItemRecordDate>
        <Link to={profilePath}>
          <Avatar
            className="log-item-avatar"
            userImage={user?.ProfileImageURL || 'https://i.pravatar.cc/300'}
          />
        </Link>
      </Styled.LogWrapper>
    </Styled.LogItemContainer>
  );
};

export default LogItem;
