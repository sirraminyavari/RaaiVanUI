import Avatar from 'components/Avatar/Avatar';
import { CV_BLACK } from 'constant/CssVariables';
import * as Styled from './RecordInfo.styles';

const RecordInfo = (props) => {
  // console.log('record info', props);

  return (
    <Styled.RecordInfoContainer>
      <Styled.RecordInfoWrapper>
        {props?.value?.recordDate}
      </Styled.RecordInfoWrapper>
      <Avatar
        color={CV_BLACK}
        className="record-info-avatar"
        userImage={
          props?.value?.userImageURL || window?.RVGlobal?.CurrentUser?.ImageURL
        }
      />
    </Styled.RecordInfoContainer>
  );
};

export default RecordInfo;
