import Modal from '../Modal/Modal';
import * as Styled from './TemplatesGallery.styles';
import useWindow from 'hooks/useWindowContext';
import TemplateSuggestionList from './TemplateSuggestionList';
import CustomCarousel from 'components/CustomCarousel/CustomCarousel';

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
          <Styled.GalleryMainContainer>
            <CustomCarousel>
              {[1, 2, 3, 4, 5, 6].map((item, index) => {
                return (
                  <div key={index}>
                    <h1>{item}</h1>
                  </div>
                );
              })}
            </CustomCarousel>
          </Styled.GalleryMainContainer>
        </Styled.ModalContentWrapper>
      </Modal>
    </Styled.TemplateGalleryContainer>
  );
};

export default TemplatesGallery;
