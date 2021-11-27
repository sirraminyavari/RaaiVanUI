import styled from 'styled-components';
import {
  CV_DISTANT,
  CV_GRAY,
  CV_GRAY_LIGHT,
  CV_WHITE,
  TCV_DEFAULT,
} from 'constant/CssVariables';
import ReloadCircleIcon from 'components/Icons/ReloadCircleIcon/ReloadCircleIcon';
import { useState } from 'react';
import Modal from 'components/Modal/Modal';
import Button from 'components/Buttons/Button';

const ResetPassword = ({ render, onResetPasswordConfirm, ...props }) => {
  const [modalInfo, setModalInfo] = useState({
    title: 'بازنشانی گذرواژه',
    contentWidth: '30%',
    middle: true,
    show: false,
    titleClass: 'rv-default',
    titleContainerClass: 'modal-title-bar',
  });

  const onModalConfirm = () => {
    setModalInfo({ ...modalInfo, show: false });
    onResetPasswordConfirm();
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
          <RemoveMessage>{'آیا قصد بازنشانی گذرواژه را دارید؟'}</RemoveMessage>
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
  gap: 2rem;
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

const buttonStyles = {
  height: '3rem',
  width: '7.5rem',
};
export default ResetPassword;
