import { createContext, useState } from 'react';
import Modal from '../Modal/Modal';
import * as Styled from './TemplatesGallery.styles';
import useWindow from 'hooks/useWindowContext';
import TemplateSuggestionList from './TemplateSuggestionList';
import MainContent from './contents/main/Main';
import CategoryContent from './contents/category/Category';
import DescriptionContent from './contents/template-description/TemplateDescription';
import Button from 'components/Buttons/Button';
import AddIcon from 'components/Icons/AddIcon/AddIcon';
import { TCV_DEFAULT } from 'constant/CssVariables';

export const MAIN_CONTENT = 'main';
export const CATEGORY_CONTENT = 'category';
export const DESCRIPTIONS_CONTENT = 'descriptions';

export const TemplatesGalleryContext = createContext({});

const TemplatesGallery = (props) => {
  const { RVDic } = useWindow();
  const [content, setContent] = useState({ name: MAIN_CONTENT, data: {} });
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const { isOpen, onModalClose } = props;

  const getContent = () => {
    switch (content.name) {
      case CATEGORY_CONTENT:
        return <CategoryContent />;
      case DESCRIPTIONS_CONTENT:
        return <DescriptionContent />;
      default:
        return <MainContent />;
    }
  };

  return (
    <TemplatesGalleryContext.Provider
      value={{
        setContent,
        currentCategory,
        setCurrentCategory,
        currentTemplate,
        setCurrentTemplate,
      }}>
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
              {getContent()}
            </Styled.GalleryInfosContainer>
          </Styled.ModalContentWrapper>
        </Modal>
      </Styled.TemplateGalleryContainer>
    </TemplatesGalleryContext.Provider>
  );
};

export default TemplatesGallery;
