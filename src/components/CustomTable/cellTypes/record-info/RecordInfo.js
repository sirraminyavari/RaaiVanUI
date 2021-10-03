import { Link } from 'react-router-dom';
import Avatar from 'components/Avatar/Avatar';
import { CV_BLACK } from 'constant/CssVariables';
import * as Styled from './RecordInfo.styles';
import { formatDeltaDays } from 'helpers/helpers';

const RecordInfo = (props) => {
  // console.log('record info', props);

  return (
    <Styled.RecordInfoContainer>
      <Styled.RecordInfoWrapper>
        <Styled.RecordInfoDate>
          {props?.value?.recordDate}
        </Styled.RecordInfoDate>
        <Styled.RecordInfoTimeSpan>
          {formatDeltaDays('2021-09-18')}
        </Styled.RecordInfoTimeSpan>
      </Styled.RecordInfoWrapper>
      <Link to="/user">
        <Avatar
          color={CV_BLACK}
          className="record-info-avatar"
          userImage={props?.value?.userImageURL || 'https://i.pravatar.cc/300'}
        />
      </Link>
    </Styled.RecordInfoContainer>
  );
};

export default RecordInfo;
