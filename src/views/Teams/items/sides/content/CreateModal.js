import * as Styled from '../../../Teams.styles';
import Modal from 'components/Modal/Modal';
import Button from 'components/Buttons/Button';
import Input from 'components/Inputs/Input';
import useWindow from 'hooks/useWindowContext';

const CreateModal = (props) => {
  const { RVDic } = useWindow();

  const {
    isOpen,
    onCancleCreate,
    onInputChange,
    onCreate,
    modalTitle,
    modalWidth,
  } = props;

  return (
    <Modal
      contentWidth={modalWidth}
      title={modalTitle}
      show={isOpen}
      onClose={onCancleCreate}>
      <Styled.ModalContentWrapper>
        <Input
          style={{ width: '100%', margin: '2rem 0' }}
          onChange={onInputChange}
        />
        <Styled.ModalButtonsWrapper>
          <Button style={{ width: '7rem' }} onClick={onCreate}>
            <Styled.ModalButtonText>{RVDic.Save}</Styled.ModalButtonText>
          </Button>
          <Button
            type="negative-o"
            style={{ width: '7rem' }}
            onClick={onCancleCreate}>
            <Styled.ModalButtonText>{RVDic.Return}</Styled.ModalButtonText>
          </Button>
        </Styled.ModalButtonsWrapper>
      </Styled.ModalContentWrapper>
    </Modal>
  );
};

export default CreateModal;
