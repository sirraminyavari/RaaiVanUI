import styled from 'styled-components';
import {
  CV_DISTANT,
  CV_FREEZED,
  CV_GRAY,
  CV_GRAY_LIGHT,
  CV_WHITE,
  TCV_DEFAULT,
  TCV_LIGHTWARM,
  TCV_WARM,
} from 'constant/CssVariables';
import ReloadCircleIcon from 'components/Icons/ReloadCircleIcon/ReloadCircleIcon';
import { useState } from 'react';
import Modal from 'components/Modal/Modal';
import Button from 'components/Buttons/Button';
import CopyIcon from 'components/Icons/CopyIcon/CopyIcon';
import { setRandomPassword } from '../../../../../../apiHelper/ApiHandlers/usersApi';

const ResetPassword = ({ render, userId, ...props }) => {
  const [modalInfo, setModalInfo] = useState({
    title: 'بازنشانی گذرواژه',
    contentWidth: '30%',
    middle: true,
    show: false,
    titleClass: 'rv-default',
    titleContainerClass: 'modal-title-bar',
  });
  const [password, setPassword] = useState(null);

  const onModalConfirm = () => {
    setRandomPassword(userId)
      .then((res) => {
        console.log(res);
        if (res?.Succeed) {
          setPassword(res?.Password);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const copyPassword = () => {
    navigator?.clipboard?.writeText(password);
  };

  const onModalCancel = () => {
    setModalInfo({ ...modalInfo, show: false });
  };

  return (
    <Container>
      <ResetButton onClick={(e) => setModalInfo({ ...modalInfo, show: true })}>
        <ReloadCircleIcon size={22} />
      </ResetButton>

      <Modal
        {...modalInfo}
        onClose={() => setModalInfo({ ...modalInfo, show: false })}>
        <ProfileWrapper>{render}</ProfileWrapper>

        <ActionContainer>
          {!password && (
            <>
              <RemoveMessage>
                {'آیا قصد بازنشانی گذرواژه را دارید؟'}
              </RemoveMessage>
              <ActionButtonContainer>
                <Button
                  type="primary"
                  style={buttonStyles}
                  onClick={() => onModalConfirm()}>
                  {'بازنشانی'}
                </Button>

                <Button
                  type="negative-o"
                  style={buttonStyles}
                  onClick={() => onModalCancel()}>
                  {'بازگشت'}
                </Button>
              </ActionButtonContainer>
            </>
          )}
          {password && (
            <>
              <PasswordChangeTitle>رمز عبور جدید کاربر</PasswordChangeTitle>

              <PasswordInput value={password} disabled />
              <ActionButtonContainer>
                <CopyButton
                  type="primary"
                  style={buttonStyles}
                  onClick={() => copyPassword()}>
                  <CopyIcon square={true} size={16} />
                  {'کپی'}
                </CopyButton>

                <Button
                  type="negative-o"
                  style={buttonStyles}
                  onClick={() => onModalCancel()}>
                  {'بازگشت'}
                </Button>
              </ActionButtonContainer>
            </>
          )}
        </ActionContainer>
      </Modal>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ResetButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${CV_WHITE};
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 100%;
  color: ${CV_DISTANT};
  cursor: pointer;

  &:hover {
    color: ${TCV_DEFAULT};
  }
`;
const ProfileWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2.5rem;
`;

const ActionContainer = styled.div`
  margin-top: 4rem;
  height: 12.6rem;
  border-radius: 0.5rem;
  background-color: ${CV_GRAY_LIGHT};
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
`;

const RemoveMessage = styled.div`
  color: ${CV_GRAY};
  font-size: 1.1rem;
  height: 1.75rem;
  line-height: 1.75rem;
`;

const ActionButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const PasswordChangeTitle = styled.div`
  font-size: 1rem;
  color: ${CV_GRAY};
  height: 1.2rem;
  line-height: 1.2rem;
`;

const PasswordInput = styled.input`
  height: 3rem;
  width: 16rem;
  border-radius: 0.3rem;
  outline: none;
  border: 1px solid ${CV_DISTANT};
  text-align: center;
  font-size: 1rem;
  background-color: ${CV_FREEZED};
`;

const CopyButton = styled.div`
  height: 3rem;
  width: 7.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  user-select: none;
  background-color: ${TCV_DEFAULT};
  color: ${CV_WHITE};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: ${TCV_LIGHTWARM};
  }
`;
const buttonStyles = {
  height: '3rem',
  width: '7.5rem',
};
export default ResetPassword;
