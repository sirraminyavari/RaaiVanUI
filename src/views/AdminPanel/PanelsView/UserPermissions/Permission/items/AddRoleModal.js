import styled from 'styled-components';
import { useEffect, useState } from 'react';
import Modal from 'components/Modal/Modal';
import { CV_GRAY, CV_WHITE, TCV_DEFAULT } from 'constant/CssVariables';
import AddIcon from 'components/Icons/AddIcon/AddIcon';
import Button from 'components/Buttons/Button';
import useWindowContext from 'hooks/useWindowContext';

const AddRoleModal = ({ children, onClose, onConfirm, info, ...props }) => {
  const [modalInfo, setModalInfo] = useState({
    ...info,
    contentWidth: '30%',
    middle: true,
    show: false,
    titleClass: 'rv-default',
    titleContainerClass: 'modal-title-bar',
  });

  const { RVDic } = useWindowContext();

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

  useEffect(() => {
    setModalInfo({ ...modalInfo, ...info });
  }, [info]);

  return (
    <DialogContainer>
      <ModalButton onClick={(e) => setModalInfo({ ...modalInfo, show: true })}>
        <AddIcon circleOutline={true} size={20} />
        <div>{RVDic?.Add}</div>
      </ModalButton>
      <Modal {...modalInfo} onClose={onModalCancel}>
        {children}
        <ActionButtonContainer>
          <Button type="primary" style={buttonStyles} onClick={onModalConfirm}>
            {RVDic?.Save}
          </Button>

          <Button
            type="negative-o"
            style={buttonStyles}
            onClick={onModalCancel}>
            {RVDic?.Return}
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
