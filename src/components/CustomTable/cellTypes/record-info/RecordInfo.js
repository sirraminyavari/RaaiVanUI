import { Link } from 'react-router-dom';
import Avatar from 'components/Avatar/Avatar';
import { CV_BLACK } from 'constant/CssVariables';
import * as Styled from './RecordInfo.styles';
import { formatDeltaDays, getURL } from 'helpers/helpers';

const RecordInfo = (props) => {
  const { cell } = props?.value;
  const { Creator, CreationDate } = cell || {};

  // console.log('record', cell);

  return (
    <Styled.RecordInfoContainer>
      <Styled.RecordInfoWrapper>
        <Styled.RecordInfoDate>
          {CreationDate || '2021-09-18'}
        </Styled.RecordInfoDate>
        <Styled.RecordInfoTimeSpan>
          {formatDeltaDays('2021-09-18')}
        </Styled.RecordInfoTimeSpan>
      </Styled.RecordInfoWrapper>
      <Link to={getURL('User', { UserID: Creator?.UserID })}>
        <Avatar
          color={CV_BLACK}
          className="record-info-avatar"
          userImage={Creator?.ProfileImageURL}
        />
      </Link>
    </Styled.RecordInfoContainer>
  );
};

export default RecordInfo;
