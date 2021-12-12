import styled from 'styled-components';
import { useState } from 'react';
import Modal from 'components/Modal/Modal';
import { CV_GRAY, CV_WHITE, TCV_DEFAULT } from 'constant/CssVariables';
import AddIcon from 'components/Icons/AddIcon/AddIcon';
import Button from 'components/Buttons/Button';

const AddRoleModal = ({ children, onClose, onConfirm, ...props }) => {
  const [modalInfo, setModalInfo] = useState({
    title: 'انتخاب کاربر',
    contentWidth: '30%',
    middle: true,
    show: false,
    titleClass: 'rv-default',
    titleContainerClass: 'modal-title-bar',
  });

  const onModalConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    setModalInfo({ ...modalInfo, show: false });
  };

  const onModalCancel = () => {
    setModalInfo({ ...modalInfo, show: false });
    if (onClose) {
      onClose();
    }
  };

  return (
    <DialogContainer>
      <ModalButton onClick={(e) => setModalInfo({ ...modalInfo, show: true })}>
        <AddIcon circleOutline={true} size={20} />
        <div>افزودن</div>
      </ModalButton>
      <Modal {...modalInfo} onClose={onModalCancel}>
        <ModalMessage>
          {'کاربران انتخاب شده به مدیریت مستندات دسترسی خواهند داشت:'}
        </ModalMessage>
        {children}
        <ActionButtonContainer>
          <Button type="primary" style={buttonStyles} onClick={onModalConfirm}>
            {'ذخیره'}
          </Button>

          <Button
            type="negative-o"
            style={buttonStyles}
            onClick={onModalCancel}>
            {'بازگشت'}
          </Button>
        </ActionButtonContainer>
      </Modal>
    </DialogContainer>
  );
};
const DialogContainer = styled.div``;
const ModalButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  height: 2rem;
  width: 7.5rem;
  border-radius: 1rem;
  background-color: ${TCV_DEFAULT};
  color: ${CV_WHITE};
  cursor: pointer;
  user-select: none;
`;

const ModalMessage = styled.div`
  height: 1.4rem;
  line-height: 1.4rem;
  color: ${CV_GRAY};
  margin: 1.8rem 0 1.5rem 0;
`;
const ActionButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
`;
const buttonStyles = {
  height: '3rem',
  width: '7.5rem',
};
export default AddRoleModal;
