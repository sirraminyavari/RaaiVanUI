import * as Styled from '../../TemplatesGallery.styles';
import SubCategoryList from './SubCategoryList';

const Category = ({ category }) => {
  return (
    <Styled.CategoryContentContainer>
      <Styled.CategoryTitle>مدیریت محصول</Styled.CategoryTitle>
      <Styled.CategoryDescription>
        این یک نوشته آزمایشی است که به طراحان و برنامه نویسان کمک میکند تا این
        عزیزان با بهره گیری از این نوشته تستی و آزمایشی بتوانند نمونه تکمیل شده
        از پروژه و طرح خودشان را به کارفرما نمایش دهند، استفاده از این متن تستی
        می تواند سرعت پیشرفت پروژه را افزایش دهد، و طراحان به جای تایپ و نگارش
        متن می توانند تنها با یک کپی و پست این متن را در کادرهای مختلف جایگزین
        .نمائید.
      </Styled.CategoryDescription>
      <SubCategoryList items={[]} />
    </Styled.CategoryContentContainer>
  );
};

export default Category;
