import Modal from '../Modal/Modal';
import * as Styled from './TemplatesGallery.styles';
import useWindow from 'hooks/useWindowContext';
import TemplateSuggestionList from './TemplateSuggestionList';
import MainContent from './contents/Main';
import Button from 'components/Buttons/Button';
import AddIcon from 'components/Icons/AddIcon/AddIcon';
import { TCV_DEFAULT } from 'constant/CssVariables';

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
            <Styled.AddTemplateButtonWrapper>
              <AddIcon
                size={22}
                color={TCV_DEFAULT}
                className="add-template-icon"
              />
              <Button
                type="primary-o"
                style={{
                  position: 'relative',
                  bottom: '-1rem',
                }}>
                ساخت تمپلیت
              </Button>
            </Styled.AddTemplateButtonWrapper>
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
