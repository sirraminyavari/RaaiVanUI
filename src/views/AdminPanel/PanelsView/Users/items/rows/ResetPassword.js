import ReloadIcon from 'components/Icons/ReloadIcon/ReloadIcon';
import { useState } from 'react';
import Modal from 'components/Modal/Modal';
import Button from 'components/Buttons/Button';
import CopyIcon from 'components/Icons/CopyIcon/CopyIcon';
import { setRandomPassword } from 'apiHelper/ApiHandlers/usersApi';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import * as Styled from './ResetPasswordStyle';

const ResetPassword = ({ render, userId, userTitle }) => {
  const { RVDic } = window;
  const [modalInfo, setModalInfo] = useState({
    title: RVDic?.ResetPassword,
    contentWidth: '30%',
    middle: true,
    show: false,
    titleClass: 'rv-default',
    titleContainerClass: 'modal-title-bar',
  });
  const [password, setPassword] = useState('');

  const onModalConfirm = async () => {
    const { Succeed, Password, ErrorText } = await setRandomPassword(userId);

    if (Succeed) {
      setPassword(Password);
    } else if (ErrorText) {
      InfoToast({
        type: 'error',
        message: RVDic?.MSG[ErrorText] || ErrorText,
      });
    }
  };

  const copyPassword = async () => {
    try {
      await navigator?.clipboard?.writeText(password);
      InfoToast({
        type: 'success',
        autoClose: true,
        message: RVDic?.RVDic.LinkCopied,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const onModalCancel = () => {
    setModalInfo({ ...modalInfo, show: false });
  };

  const onModalOpen = () => {
    setPassword('');
    setModalInfo({ ...modalInfo, show: true });
  };

  return (
    <Styled.Container>
      <Styled.ResetButton onClick={onModalOpen}>
        <ReloadIcon size={22} />
      </Styled.ResetButton>

      <Modal
        {...modalInfo}
        onClose={() => setModalInfo({ ...modalInfo, show: false })}
      >
        <Styled.ProfileWrapper>{render}</Styled.ProfileWrapper>

        <Styled.ActionContainer>
          {!password && (
            <>
              <Styled.RemoveMessage>
                {RVDic.Confirms.DoYouWantToResetPasswordForUserN.replace(
                  '[n]',
                  `${userTitle || ''}`
                )}
              </Styled.RemoveMessage>
              <Styled.ActionButtonContainer>
                <Button
                  type="primary"
                  style={buttonStyles}
                  onClick={() => onModalConfirm()}
                >
                  {RVDic?.Reset}
                </Button>

                <Button
                  type="negative-o"
                  style={buttonStyles}
                  onClick={() => onModalCancel()}
                >
                  {RVDic?.Return}
                </Button>
              </Styled.ActionButtonContainer>
            </>
          )}
          {password && (
            <>
              <Styled.PasswordChangeTitle>
                {RVDic?.NewPassword}
              </Styled.PasswordChangeTitle>

              <Styled.PasswordInput value={password} disabled />
              <Styled.ActionButtonContainer>
                <Styled.CopyButton
                  type="primary"
                  style={buttonStyles}
                  onClick={() => copyPassword()}
                >
                  <CopyIcon square={true} size={16} />
                  {RVDic?.Copy}
                </Styled.CopyButton>

                <Button
                  type="negative-o"
                  style={buttonStyles}
                  onClick={() => onModalCancel()}
                >
                  {RVDic?.Return}
                </Button>
              </Styled.ActionButtonContainer>
            </>
          )}
        </Styled.ActionContainer>
      </Modal>
    </Styled.Container>
  );
};
const buttonStyles = {
  height: '3rem',
  width: '7.5rem',
};
export default ResetPassword;
