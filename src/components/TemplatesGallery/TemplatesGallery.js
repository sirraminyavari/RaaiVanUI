import { createContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router';
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
import { getTemplates } from 'apiHelper/apiFunctions';
import { provideTemplatesForTree } from './templateUtils';
import { TEMPLATES_PATH } from 'constant/constants';

export const MAIN_CONTENT = 'main';
export const CATEGORY_CONTENT = 'category';
export const DESCRIPTIONS_CONTENT = 'descriptions';

export const TemplatesGalleryContext = createContext({});

const TemplatesGallery = (props) => {
  const { RVDic } = useWindow();
  const history = useHistory();
  const [content, setContent] = useState({ name: MAIN_CONTENT, data: {} });
  const [templatesObject, setTemplatesObject] = useState({});
  const [tree, setTree] = useState({});
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

  //! Fetch templates.
  useEffect(() => {
    getTemplates()
      .then((response) => {
        setTree(provideTemplatesForTree(response));
        setTemplatesObject(response);
      })
      .catch((error) => console.log(error));

    //! Clean up.
    return () => {
      setTree({});
      setTemplatesObject({});
    };
  }, []);

  const handleMakeTemplate = () => {
    history.push(TEMPLATES_PATH);
    onModalClose();
  };

  return (
    <TemplatesGalleryContext.Provider
      value={{
        setContent,
        currentCategory,
        setCurrentCategory,
        currentTemplate,
        setCurrentTemplate,
        templatesObject,
        tree,
        setTree,
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
              <Styled.AddTemplateButtonWrapper onClick={handleMakeTemplate}>
                <AddIcon
                  size={22}
                  color={TCV_DEFAULT}
                  className="add-template-icon"
                />
                <Button type="primary-o" classes="add-template-button">
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
