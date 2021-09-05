import Avatar from 'components/Avatar/Avatar';
import { CV_BLACK } from 'constant/CssVariables';
import * as Styled from './RecordInfo.styles';

const RecordInfo = (props) => {
  // console.log('record info', props);

  return (
    <Styled.RecordInfoContainer>
      <div>{props?.value?.recordDate}</div>
      <Avatar
        color={CV_BLACK}
        style={{ width: '2.7rem', minWidth: '2.7rem' }}
        userImage={
          props?.value?.userImageURL || window?.RVGlobal?.CurrentUser?.ImageURL
        }
      />
    </Styled.RecordInfoContainer>
  );
};

export default RecordInfo;
