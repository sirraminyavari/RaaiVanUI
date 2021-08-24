import TemplateCard from '../../TemplateCard';
import * as Styled from '../../TemplatesGallery.styles';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';

const SubCategoryList = ({ items }) => {
  return (
    <Styled.SubCategoryContainer>
      <PerfectScrollbar className="template-sub-category-scroll">
        {[...Array(10).keys()].map((item) => {
          return <TemplateCard mode="category" key={item} />;
        })}
      </PerfectScrollbar>
    </Styled.SubCategoryContainer>
  );
};

export default SubCategoryList;
