import { TCV_DEFAULT } from 'constant/CssVariables';
import * as Styled from 'views/Profile/Profile.styles';
import InlineEditInput from 'components/InlineEdit/InlineEdit';

const ProfileInfoItem = (props) => {
  const { icon: Icon, text, isAuthUser } = props;

  const handleEditItem = (text) => {
    console.log(text);
  };

  return (
    <Styled.InfoItemWrapper>
      <Icon size={20} color={TCV_DEFAULT} />
      {!isAuthUser ? (
        <InlineEditInput
          onSetText={handleEditItem}
          text={text}
          containerClasses="user-info-inline-edit-container"
          textClasses="user-info-inline-edit-text"
        />
      ) : (
        <Styled.InfoItemText>{text}</Styled.InfoItemText>
      )}
    </Styled.InfoItemWrapper>
  );
};

export default ProfileInfoItem;
