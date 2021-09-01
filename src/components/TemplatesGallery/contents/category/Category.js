import { useContext } from 'react';
import * as Styled from '../../TemplatesGallery.styles';
import SubCategoryList from './SubCategoryList';
import { TemplatesGalleryContext } from '../../TemplatesGallery';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import { decodeBase64 } from 'helpers/helpers';

const Category = () => {
  const { currentCategory } = useContext(TemplatesGalleryContext);

  console.log(currentCategory);

  return (
    <PerfectScrollbar className="template-category-scrollbar">
      <Styled.CategoryContentContainer>
        <Styled.CategoryTitle>
          {decodeBase64(currentCategory?.TypeName)}
        </Styled.CategoryTitle>
        <Styled.CategoryDescription>
          {currentCategory?.Description || 'Category Description'}
        </Styled.CategoryDescription>
        <SubCategoryList items={currentCategory?.Tags} />
      </Styled.CategoryContentContainer>
    </PerfectScrollbar>
  );
};

export default Category;
