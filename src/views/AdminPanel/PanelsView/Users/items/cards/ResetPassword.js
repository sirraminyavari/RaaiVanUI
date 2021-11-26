import styled from 'styled-components';
import { CV_DISTANT, CV_WHITE } from 'constant/CssVariables';
import ReloadCircleIcon from 'components/Icons/ReloadCircleIcon/ReloadCircleIcon';
import { useState } from 'react';
import Modal from 'components/Modal/Modal';

const ResetPassword = ({ render, ...props }) => {
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
  };

  const onModalCancel = () => {
    setModalInfo({ ...modalInfo, show: false });
  };

  return (
    <>
      <ResetButtonContainer
        onClick={(e) => setModalInfo({ ...modalInfo, show: true })}>
        <ReloadCircleIcon size={22} />
      </ResetButtonContainer>

      <Modal {...modalInfo}>
        <ProfileWrapper>{render}</ProfileWrapper>
      </Modal>
    </>
  );
};

const ResetButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${CV_WHITE};
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 100%;
  color: ${CV_DISTANT};
  cursor: pointer;
`;
const ProfileWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export default ResetPassword;
