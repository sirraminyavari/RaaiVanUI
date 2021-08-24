import * as Styled from '../../TemplatesGallery.styles';
import CustomSwiper from 'components/CustomSwiper/CustomSwiper';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import Button from 'components/Buttons/Button';

const TemplateDescription = ({ template }) => {
  return (
    <PerfectScrollbar className="template-description-scrollbar">
      <Styled.TemplateDescriptionWrapper>
        <Button type="negative-o" classes="template-back-button">
          بازگشت
        </Button>
        <Styled.TemplateTitleInDescription>
          فیچر محصول
        </Styled.TemplateTitleInDescription>
        <Styled.TemplatePhotosWrapper>
          <CustomSwiper
            pagination
            grabCursor
            navigation
            numberBullet
            slidesPerView={1}
            spaceBetween={12}>
            {[...Array(10).keys()].map((item, index) => {
              return (
                <div
                  key={index}
                  style={{
                    width: '80%',
                    height: '87%',
                    backgroundColor: '#777',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#fff',
                    fontSize: '1.5rem',
                    marginRight: '10%',
                  }}>
                  Image
                </div>
              );
            })}
          </CustomSwiper>
        </Styled.TemplatePhotosWrapper>
        <Button
          style={{ width: '15rem', height: '2rem', margin: '1rem 0 2rem 0' }}>
          استفاده از این قالب
        </Button>
        <Styled.TemplateDescription>
          این یک نوشته آزمایشی است که به طراحان و برنامه نویسان کمک میکند تا این
          عزیزان با بهره گیری از این نوشته تستی و آزمایشی بتوانند نمونه تکمیل
          شده از پروژه و طرح خودشان را به کارفرما نمایش دهند، استفاده از این متن
          تستی می تواند سرعت پیشرفت پروژه را افزایش دهد، و طراحان به جای تایپ و
          نگارش متن می توانند تنها با یک کپی و پست این متن را در کادرهای مختلف
          جایگزین .نمائید. این نوشته توسط سایت لورم ایپسوم فارسی نگاشته شده
          استایشی بتوانند نمونه تکمیل شده از پروژه و طرح خودشان را به کارفرما
          نمایش دهند، استفاده از این متن تستی می تواند سرعت پیشرفت پروژه را
          افزایش دهد، و طراحان به جای تایپ و نگارش متن می توانند تنها با یک کپی
          و پست این متن را در کادرهای مختلف جایگزین .نمائید. این نوشته توسط سایت
          لورم ایپسوم فارسی نگاشته شده استایشی بتوانند نمونه تکمیل شده از پروژه
          و طرح خودشان را به کارفرما نمایش دهند، استفاده از این متن تستی می
          تواند سرعت پیشرفت پروژه را افزایش دهد، و طراحان به جای تایپ و نگارش
          متن می توانند تنها با یک کپی و پست این متن را در کادرهای مختلف جایگزین
          .نمائید. این نوشته توسط سایت لورم ایپسوم فارسی نگاشته شده استایشی
          بتوانند نمونه تکمیل شده از پروژه و طرح خودشان را به کارفرما نمایش
          دهند، استفاده از این متن تستی می تواند سرعت پیشرفت پروژه را افزایش
          دهد، و طراحان به جای تایپ و نگارش متن می توانند تنها با یک کپی و پست
          این متن را در کادرهای مختلف جایگزین .نمائید. این نوشته توسط سایت لورم
          ایپسوم فارسی نگاشته شده استایشی بتوانند نمونه تکمیل شده از پروژه و طرح
          خودشان را به کارفرما نمایش دهند، استفاده از این متن تستی می تواند سرعت
          پیشرفت پروژه را افزایش دهد، و طراحان به جای تایپ و نگارش متن می توانند
          تنها با یک کپی و پست این متن را در کادرهای مختلف جایگزین .نمائید. این
          نوشته توسط سایت لورم ایپسوم فارسی نگاشته شده است
        </Styled.TemplateDescription>
      </Styled.TemplateDescriptionWrapper>
    </PerfectScrollbar>
  );
};

export default TemplateDescription;
