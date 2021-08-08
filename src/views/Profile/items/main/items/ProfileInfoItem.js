import { useState } from 'react';
import { CV_RED, TCV_DEFAULT } from 'constant/CssVariables';
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
    type,
  } = props;
  const [infoText, setInfoText] = useState(text);
  const [error, setError] = useState('');

  const isAdminAndNotSaas =
    RVGlobal?.IsSystemAdmin && !RVGlobal?.SAASBasedMultiTenancy;

  const handleEditItem = (text) => {
    // console.log(text);
    setInfoText(text);
    setError('');
    onEdit && onEdit(text);
  };

  const handleInlineEditChange = (value) => {
    if (!!value?.error) {
      setError(value?.error);
    } else {
      setError('');
    }
  };

  return (
    <Styled.InfoItemWrapper>
      <div>
        <Icon size={20} color={TCV_DEFAULT} />
      </div>
      {isAuthUser || isAdminAndNotSaas ? (
        <InlineEditInput
          onSetText={handleEditItem}
          onChange={handleInlineEditChange}
          text={infoText}
          type={type}
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
      {!!error && <Styled.InfoItemError>{error}</Styled.InfoItemError>}
    </Styled.InfoItemWrapper>
  );
};

export default ProfileInfoItem;
