import styled from 'styled-components';
import Modal from 'components/Modal/Modal';
import { useState } from 'react';
import Button from 'components/Buttons/Button';
import Heading from 'components/Heading/Heading';
import useWindowContext from 'hooks/useWindowContext';

const UserDeleteButton = ({ children, render, onRemoveConfirm, ...rest }) => {
  const { RVDic } = useWindowContext();
  const [modalInfo, setModalInfo] = useState({
    title: RVDic?.RemoveN.replace(`[n]`, RVDic?.User),
    contentWidth: '30%',
    middle: true,
    show: false,
    titleClass: 'rv-red',
    titleContainerClass: 'modal-title-bar',
  });

  const onModalConfirm = () => {
    setModalInfo({ ...modalInfo, show: false });
    onRemoveConfirm();
  };

  const onModalCancel = () => {
    setModalInfo({ ...modalInfo, show: false });
  };
  return (
    <>
      <ButtonContainer>
        <ButtonView onClick={() => setModalInfo({ ...modalInfo, show: true })}>
          {children}
        </ButtonView>
      </ButtonContainer>

      <Modal
        {...modalInfo}
        onClose={() => setModalInfo({ ...modalInfo, show: false })}>
        <ProfileWrapper>{render}</ProfileWrapper>

        <ModalMessage>
          {RVDic?.Confirms.DoYouWantToRemoveN.replace(`[n]`, RVDic?.User)}
        </ModalMessage>

        <ModalHint> {RVDic?._HelpRemoveUser}</ModalHint>

        <ModelActionBar>
          <Button
            type="negative"
            style={buttonStyles}
            onClick={() => onModalConfirm()}>
            {RVDic?.Remove}
          </Button>

          <Button
            type="primary-o"
            style={buttonStyles}
            onClick={() => onModalCancel()}>
            {RVDic?.Return}
          </Button>
        </ModelActionBar>
      </Modal>
    </>
  );
};

const ButtonContainer = styled.div`
  width: 100%;
  text-align: end;
  padding-left: 1.5rem;
`;

const ButtonView = styled.button`
  outline: none;
  color: var(--rv-red-color);
  background-color: transparent;
  border: 1px solid var(--rv-red-color);
  height: 1.7rem;
  line-height: 1.7rem;
  padding: 0 1.7rem;
  border-radius: 0.5rem;
  &:hover {
    background-color: var(--rv-red-color-verysoft);
  }
`;

const ProfileWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalMessage = styled(Heading).attrs({
  type: 'h4',
})`
  text-align: center;
  font-size: 1rem;
  color: var(--rv-gray-color-dark);
  font-weight: 500 !important;
  line-height: 1.6rem;
  margin: 1rem auto;
`;

const ModalHint = styled.p`
  text-align: center;
  line-height: 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--rv-red-color);
`;

const ModelActionBar = styled.div`
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2.2rem;
`;

const buttonStyles = {
  height: '3rem',
  width: '7.5rem',
};
export default UserDeleteButton;
