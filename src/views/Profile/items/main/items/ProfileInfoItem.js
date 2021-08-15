import { useState } from 'react';
import { CV_RED, TCV_DEFAULT } from 'constant/CssVariables';
import * as Styled from 'views/Profile/Profile.styles';
import InlineEditInput from 'components/InlineEdit/InlineEdit';
import useWindow from 'hooks/useWindowContext';
import TextArea from 'components/Inputs/TextArea/TextArea';

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
    inlineInputClass,
    inlineTextClass,
  } = props;
  const [infoText, setInfoText] = useState(text);
  const [error, setError] = useState('');

  const isSaas = (RVGlobal || {}).SAASBasedMultiTenancy;
  const isAdmin = (RVGlobal || {}).IsSystemAdmin;
  const isAdminAndNotSaas = isAdmin && !isSaas;

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
      {Icon && (
        <div>
          <Icon size={20} color={TCV_DEFAULT} />
        </div>
      )}
      {isAuthUser || isAdminAndNotSaas ? (
        !!multiline ? (
          <TextArea
            initialValue={infoText}
            simpleMode={true}
            getValue={handleEditItem}
          />
        ) : (
          <InlineEditInput
            onSetText={handleEditItem}
            onChange={handleInlineEditChange}
            text={infoText}
            type={type}
            containerClasses="user-info-inline-edit-container"
            textClasses={`user-info-inline-edit-text ${inlineTextClass}`}
            inputClasses={`user-info-inline-edit-input ${inlineInputClass}`}
            inputPlaceholder={placeholder}
          />
        )
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
