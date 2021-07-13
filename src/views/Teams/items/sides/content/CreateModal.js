import * as Styled from 'views/Teams/Teams.styles';
import Modal from 'components/Modal/Modal';
import Button from 'components/Buttons/Button';
import useWindow from 'hooks/useWindowContext';
import { TC_DEFAULT, C_GRAY, BG_GRAY_LIGHT } from 'constant/Colors';
import AnimatedInput from 'components/Inputs/AnimatedInput';

const CreateModal = (props) => {
  const { RVDic } = useWindow();

  const {
    isOpen,
    onCancleCreate,
    onInputChange,
    inputValue,
    onCreate,
    modalTitle,
    modalWidth,
    placeholder,
  } = props;

  return (
    <Modal
      titleClass={TC_DEFAULT}
      contentWidth={modalWidth}
      contentClass="create-team-modal"
      titleContainerClass="create-team-modal-header"
      title={modalTitle}
      show={isOpen}
      onClose={onCancleCreate}>
      <Styled.CreateModalWrapper>
        <AnimatedInput
          value={inputValue}
          placeholderClass={C_GRAY}
          onChange={onInputChange}
          placeholder={placeholder}
          style={{ width: '100%', margin: '2rem 0' }}
        />
        <Styled.ModalButtonsWrapper>
          <Button
            style={{ width: '7rem', margin: '0 2rem' }}
            onClick={onCreate}>
            <Styled.ModalButtonText>{RVDic.Save}</Styled.ModalButtonText>
          </Button>
          <Button
            type="negative-o"
            style={{ width: '7rem', margin: '0 2rem' }}
            onClick={onCancleCreate}>
            <Styled.ModalButtonText>{RVDic.Return}</Styled.ModalButtonText>
          </Button>
        </Styled.ModalButtonsWrapper>
      </Styled.CreateModalWrapper>
    </Modal>
  );
};

export default CreateModal;
