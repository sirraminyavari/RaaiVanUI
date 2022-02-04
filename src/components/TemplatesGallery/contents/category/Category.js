import { useContext } from 'react';
import * as Styled from '../../TemplatesGallery.styles';
import SubCategoryList from './SubCategoryList';
import { TemplatesGalleryContext } from '../../TemplatesGallery';
import ScrollBarProvider from 'components/ScrollBarProvider/ScrollBarProvider';
import { decodeBase64 } from 'helpers/helpers';
import useWindow from 'hooks/useWindowContext';
import { WindowContext } from 'context/WindowProvider';
import Button from 'components/Buttons/Button';
import { MAIN_CONTENT } from 'constant/constants';
import Heading from 'components/Heading/Heading';

const Category = () => {
  const { currentCategory, setContent, setCurrentTemplate } = useContext(
    TemplatesGalleryContext
  );
  const { RVDic } = useWindow(WindowContext);

  const handleReturnClick = () => {
    setContent({ name: MAIN_CONTENT, data: {} });
    setCurrentTemplate(null);
  };

  return (
    <ScrollBarProvider>
      <Styled.CategoryContentContainer>
        <Button
          type="negative-o"
          classes="template-back-button"
          onClick={handleReturnClick}>
          {RVDic.Return}
        </Button>
        <Styled.CategoryTitle>
          <Heading type="h1">
            {decodeBase64(currentCategory?.Name) || RVDic?.Other}
          </Heading>
        </Styled.CategoryTitle>
        <Styled.CategoryDescription>
          {decodeBase64(currentCategory?.Description) || 'Category Description'}
        </Styled.CategoryDescription>
        <SubCategoryList
          items={currentCategory?.Templates || currentCategory}
        />
      </Styled.CategoryContentContainer>
    </ScrollBarProvider>
  );
};

export default Category;
