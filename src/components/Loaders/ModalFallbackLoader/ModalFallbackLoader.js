import Modal from 'components/Modal/Modal';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import * as Styled from './ModalFallbackLoader.styles';

const ModalFallbackLoader = () => {
  return (
    <Styled.ModalFallbackWrapper>
      <Modal
        show={true}
        titleContainerClass="modal-fallback-title-container"
        contentClass="modal-fallback-content">
        <LogoLoader />
      </Modal>
    </Styled.ModalFallbackWrapper>
  );
};

export default ModalFallbackLoader;
