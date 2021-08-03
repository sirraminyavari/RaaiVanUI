import { useState } from 'react';
import { TCV_DEFAULT } from 'constant/CssVariables';
import * as Styled from 'views/Profile/Profile.styles';
import InlineEditInput from 'components/InlineEdit/InlineEdit';

const ProfileInfoItem = (props) => {
  const { icon: Icon, text, isAuthUser, placeholder, multiline } = props;
  const [infoText, setInfoText] = useState(text);

  const handleEditItem = (text) => {
    console.log(text);
    setInfoText(text);
  };

  return (
    <Styled.InfoItemWrapper>
      <div>
        <Icon size={20} color={TCV_DEFAULT} />
      </div>
      {!isAuthUser ? (
        <InlineEditInput
          onSetText={handleEditItem}
          text={infoText}
          containerClasses="user-info-inline-edit-container"
          textClasses="user-info-inline-edit-text"
          inputClasses="user-info-inline-edit-input"
          inputPlaceholder={placeholder}
          multiline={!!multiline}
          textareaClasses="user-info-inline-edit-textarea"
        />
      ) : (
        <Styled.InfoItemText>{text}</Styled.InfoItemText>
      )}
    </Styled.InfoItemWrapper>
  );
};

export default ProfileInfoItem;
