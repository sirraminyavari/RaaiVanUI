import * as Styled from '../../TemplatesGallery.styles';
import CustomSwiper from 'components/CustomSwiper/CustomSwiper';

const TemplateDescription = ({ template }) => {
  return (
    <Styled.TemplateDescriptionContainer>
      <Styled.TemplateTitleInDescription>
        فیچر محصول
      </Styled.TemplateTitleInDescription>
      <Styled.TemplatePhotosWrapper>
        <CustomSwiper pagination grabCursor slidesPerView={1} spaceBetween={10}>
          {[...Array(10).keys()].map((item, index) => {
            return (
              <div
                style={{
                  width: '100%',
                  height: '87%',
                  backgroundColor: '#777',
                }}>
                Image
              </div>
            );
          })}
        </CustomSwiper>
      </Styled.TemplatePhotosWrapper>
      <div>
        این یک نوشته آزمایشی است که به طراحان و برنامه نویسان کمک میکند تا این
        عزیزان با بهره گیری از این نوشته تستی و آزمایشی بتوانند نمونه تکمیل شده
        از پروژه و طرح خودشان را به کارفرما نمایش دهند، استفاده از این متن تستی
        می تواند سرعت پیشرفت پروژه را افزایش دهد، و طراحان به جای تایپ و نگارش
        متن می توانند تنها با یک کپی و پست این متن را در کادرهای مختلف جایگزین
        .نمائید. این نوشته توسط سایت لورم ایپسوم فارسی نگاشته شده است
      </div>
    </Styled.TemplateDescriptionContainer>
  );
};

export default TemplateDescription;
