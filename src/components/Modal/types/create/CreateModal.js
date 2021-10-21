import * as Styled from 'components/Modal/types/ModalTypes.styles';
import Modal from 'components/Modal/Modal';
import Button from 'components/Buttons/Button';
import useWindow from 'hooks/useWindowContext';
import { TC_DEFAULT, C_GRAY } from 'constant/Colors';
import AnimatedInput from 'components/Inputs/AnimatedInput';

const CreateModal = (props) => {
  const { RVDic } = useWindow();

  const {
    isOpen,
    onCancelCreate,
    onInputChange,
    inputValue,
    onCreate,
    modalTitle,
    modalWidth,
    placeholder,
  } = props;

  return (
    <Styled.ModalContainer>
      <Modal
        titleClass={TC_DEFAULT}
        contentWidth={modalWidth}
        contentClass="create-modal-container"
        titleContainerClass="create-modal-header"
        title={modalTitle}
        show={isOpen}
        onClose={onCancelCreate}>
        <Styled.ModalContentWrapper>
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
              disable={!inputValue}
              onClick={onCreate}>
              <Styled.ModalButtonText>{RVDic.Save}</Styled.ModalButtonText>
            </Button>
            <Button
              type="negative-o"
              style={{ width: '7rem', margin: '0 2rem' }}
              onClick={onCancelCreate}>
              <Styled.ModalButtonText>{RVDic.Return}</Styled.ModalButtonText>
            </Button>
          </Styled.ModalButtonsWrapper>
        </Styled.ModalContentWrapper>
      </Modal>
    </Styled.ModalContainer>
  );
};

export default CreateModal;
