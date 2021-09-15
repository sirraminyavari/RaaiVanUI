import TemplateCard from '../../TemplateCard';
import * as Styled from '../../TemplatesGallery.styles';
// import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';

const SubCategoryList = ({ items }) => {
  return (
    <Styled.SubCategoryContainer>
      {/* <PerfectScrollbar className="template-sub-category-scroll"> */}
      {items?.map((item) => {
        return (
          <TemplateCard mode="grid" template={item} key={item?.NodeTypeID} />
        );
      })}
      {/* </PerfectScrollbar> */}
    </Styled.SubCategoryContainer>
  );
};

export default SubCategoryList;
