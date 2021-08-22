import Modal from '../Modal/Modal';
import * as Styled from './TemplatesGallery.styles';
import useWindow from 'hooks/useWindowContext';
import TemplateSuggestionList from './TemplateSuggestionList';
import MainContent from './contents/Main';

const TemplatesGallery = (props) => {
  const { RVDic } = useWindow();
  const { isOpen, onModalClose } = props;

  return (
    <Styled.TemplateGalleryContainer>
      <Modal
        contentWidth="70%"
        titleContainerClass="templates-modal-title-container"
        show={isOpen}
        onClose={onModalClose}>
        <Styled.ModalContentWrapper>
          <Styled.GalleryListContainer>
            <Styled.ModalTitle>{RVDic.TemplatesGallery}</Styled.ModalTitle>
            <TemplateSuggestionList />
          </Styled.GalleryListContainer>
          <Styled.GalleryInfosContainer>
            <MainContent />
          </Styled.GalleryInfosContainer>
        </Styled.ModalContentWrapper>
      </Modal>
    </Styled.TemplateGalleryContainer>
  );
};

export default TemplatesGallery;
