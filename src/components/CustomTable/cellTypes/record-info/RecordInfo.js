import Avatar from 'components/Avatar/Avatar';
import { CV_BLACK } from 'constant/CssVariables';
import * as Styled from './RecordInfo.styles';

const RecordInfo = (props) => {
  // console.log('record info', props);

  return (
    <Styled.RecordInfoContainer>
      <Styled.RecordInfoWrapper>
        <Styled.RecordInfoDate>
          {props?.value?.recordDate}
        </Styled.RecordInfoDate>
        <Styled.RecordInfoTimeSpan>۱۵ روز قبل</Styled.RecordInfoTimeSpan>
      </Styled.RecordInfoWrapper>
      <Avatar
        color={CV_BLACK}
        className="record-info-avatar"
        userImage={props?.value?.userImageURL || 'https://i.pravatar.cc/300'}
      />
    </Styled.RecordInfoContainer>
  );
};

export default RecordInfo;
