import { useContext } from 'react';
import * as Styled from '../../TemplatesGallery.styles';
import SubCategoryList from './SubCategoryList';
import { TemplatesGalleryContext } from '../../TemplatesGallery';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';

const Category = () => {
  const { currentCategory } = useContext(TemplatesGalleryContext);

  return (
    <PerfectScrollbar className="template-category-scrollbar">
      <Styled.CategoryContentContainer>
        <Styled.CategoryTitle>
          {currentCategory?.data?.title}
        </Styled.CategoryTitle>
        <Styled.CategoryDescription>
          {currentCategory?.data?.description}
        </Styled.CategoryDescription>
        <SubCategoryList items={[]} />
      </Styled.CategoryContentContainer>
    </PerfectScrollbar>
  );
};

export default Category;
