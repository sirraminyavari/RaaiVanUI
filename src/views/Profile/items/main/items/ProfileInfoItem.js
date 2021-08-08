import { useState } from 'react';
import { TCV_DEFAULT } from 'constant/CssVariables';
import * as Styled from 'views/Profile/Profile.styles';
import InlineEditInput from 'components/InlineEdit/InlineEdit';
import useWindow from 'hooks/useWindowContext';

const ProfileInfoItem = (props) => {
  const { RVGlobal } = useWindow();
  const {
    icon: Icon,
    text,
    isAuthUser,
    placeholder,
    multiline,
    onEdit,
  } = props;
  const [infoText, setInfoText] = useState(text);

  const isAdminAndNotSaas =
    RVGlobal?.IsSystemAdmin && !RVGlobal?.SAASBasedMultiTenancy;

  const handleEditItem = (text) => {
    // console.log(text);
    setInfoText(text);
    onEdit && onEdit(text);
  };

  return (
    <Styled.InfoItemWrapper>
      <div>
        <Icon size={20} color={TCV_DEFAULT} />
      </div>
      {isAuthUser || isAdminAndNotSaas ? (
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
        <Styled.InfoItemText hasText={!!infoText}>
          {!!infoText ? infoText : placeholder}
        </Styled.InfoItemText>
      )}
    </Styled.InfoItemWrapper>
  );
};

export default ProfileInfoItem;
