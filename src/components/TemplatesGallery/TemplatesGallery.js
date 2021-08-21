import Modal from '../Modal/Modal';
import * as Styled from './TemplatesGallery.styles';
import useWindow from 'hooks/useWindowContext';
import TemplateSuggestionList from './TemplateSuggestionList';
import CustomSwiper from 'components/CustomSwiper/CustomSwiper';
import TemplateCard from './TemplateCard';

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
            <div>more info</div>
            <CustomSwiper
              grabCursor
              freeMode
              slidesPerView={3}
              spaceBetween={15}>
              {[...Array(10).keys()].map((item, index) => {
                return <TemplateCard index={item + 1} key={index} />;
              })}
            </CustomSwiper>
          </Styled.GalleryMainContainer>
        </Styled.ModalContentWrapper>
      </Modal>
    </Styled.TemplateGalleryContainer>
  );
};

export default TemplatesGallery;
