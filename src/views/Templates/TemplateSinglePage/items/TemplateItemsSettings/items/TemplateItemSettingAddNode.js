import styled from 'styled-components';
import * as Styles from '../TemplateItemSettingStyles';
import { TCV_DEFAULT, CV_DISTANT } from 'constant/CssVariables';
import { FLEX_RCB, FLEX_CCC } from 'constant/StyledCommonCss';
import { IoFileTrayFullOutline } from 'react-icons/io5';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import { useState } from 'react';
import InfoToast from 'components/toasts/info-toast/InfoToast';

const TemplateItemSettingAddNew = ({ children, onClose, onSave }) => {
  const { RVDic } = window;

  const [name, setName] = useState('');

  const handleNameChange = (e) => {
    setName(e?.target?.value);
  };

  const saveNode = async () => {
    const { ErrorText } = await onSave(name);
    if (ErrorText) {
      InfoToast({
        type: 'error',
        message: RVDic?.MSG[ErrorText] || ErrorText,
      });
    } else {
      setName('');
      onClose && onClose();
    }
  };

  const saveAndCreate = async () => {
    const { ErrorText } = await onSave(name);
    if (ErrorText) {
      InfoToast({
        type: 'error',
        message: RVDic?.MSG[ErrorText] || ErrorText,
      });
    } else {
      setName('');
    }
  };

  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <ItemContainer>
      <IconContainer>
        <IoFileTrayFullOutline size={24} />
      </IconContainer>

      <Input
        value={name}
        placeholder="سند مارکتینگ جدید"
        onChange={handleNameChange}
      />

      <Spacer />

      <div>
        <Styles.AddNewNodeActionRow>
          <Styles.SaveNewNodeButton onClick={saveNode}>
            {RVDic?.Save}
          </Styles.SaveNewNodeButton>

          <Styles.SaveAndAddNewNodeButton onClick={saveAndCreate}>
            {'ذخیره و ایجاد بعدی'}
          </Styles.SaveAndAddNewNodeButton>

          <Styles.CancelNodeCreateButton onClick={handleClose}>
            <CloseIcon outline={true} size={20} />
          </Styles.CancelNodeCreateButton>
        </Styles.AddNewNodeActionRow>
      </div>
    </ItemContainer>
  );
};

const ItemContainer = styled.div`
  ${FLEX_RCB};
  height: 5rem;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  box-sizing: content-box;
  gap: 2.5rem;
`;

const IconContainer = styled.div`
  ${FLEX_CCC};
  width: 5rem;
  color: ${CV_DISTANT};
  gap: 0.8rem;
`;

const Input = styled.input`
  border: none;
  border-bottom: 0.0625rem solid #e6f4f1;
  max-width: 20rem;
  width: 100%;
  background-color: transparent;
  height: 2.5rem;
  line-height: 2.5rem;
  outline: none;

  &::placeholder {
    font-size: 1rem;
  }
`;

const Spacer = styled.div`
  flex: 1;
`;

export default TemplateItemSettingAddNew;
