import { useContext, useState } from 'react';
import CustomSwiper from 'components/CustomSwiper/CustomSwiper';
import TemplateCard from '../../TemplateCard';
import useWindow from 'hooks/useWindowContext';
import * as Styled from '../../TemplatesGallery.styles';
import GalleryMainImage from 'assets/images/template-gallery.svg';
import Input from 'components/Inputs/Input';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import { CV_DISTANT } from 'constant/CssVariables';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import { isEmpty } from 'helpers/helpers';
import { parseTemplates } from 'components/TemplatesGallery/templateUtils';
import {
  TemplatesGalleryContext,
  DESCRIPTIONS_CONTENT,
} from '../../TemplatesGallery';

const TemplateGalleryMain = () => {
  const { RVDic } = useWindow();
  const [isTransition, setIsTransition] = useState(false);
  const { templatesObject, setContent, setCurrentTemplate } = useContext(
    TemplatesGalleryContext
  );
  const parsedTemplates = parseTemplates(templatesObject);
  const {
    AllTemplates,
    //  Tags,
    // TemplatesWithoutTag
  } = parsedTemplates || {};

  const handleClickCard = (template) => {
    setContent({ name: DESCRIPTIONS_CONTENT, data: { template } });
    setCurrentTemplate(template);
  };

  const handleSliderTransition = (value) => {
    setIsTransition(value);
  };

  return (
    <div>
      <Styled.MainContentInfoSection>
        <Styled.MainContentInfoWrapper>
          <Styled.MainContentTitle>
            {RVDic.TemplatesGallery}
          </Styled.MainContentTitle>
          <Styled.MainContentExcerpt>
            مجموعه قالب‌های آماده برای استفاده بهتر از کلیک‌مایند
          </Styled.MainContentExcerpt>
          <Styled.MainContentDescription>
            هر تیم می تواند دارای تعدادی قالب محتوا باشد که یا خودتان ساخته‌اید
            یا از بین قالب‌های آماده فعال کرده اید. اعضاء تیم می‌توانند این
            قالب‌ها را تکمیل کنند. شما می توانید قالب‌ها را به هم مرتبط کنید تا
            در زمان ثبت اطلاعات، پیوستگی آن‌ها نیز حفظ شود.
          </Styled.MainContentDescription>
          <Styled.MainContentInputWrapper>
            <Input
              type="text"
              style={{ width: '100%' }}
              placeholder="جستجو در همه قالب‌ها"
            />
            <SearchIcon
              size={20}
              color={CV_DISTANT}
              className="gallery-input-icon"
            />
          </Styled.MainContentInputWrapper>
        </Styled.MainContentInfoWrapper>
        <Styled.MainContentImageWrapper>
          <img src={GalleryMainImage} alt="template-gallery-main" />
        </Styled.MainContentImageWrapper>
      </Styled.MainContentInfoSection>

      <Styled.MainContentSwiperSection>
        <Styled.MainSwiperTitle>پیشنهاد کلیک‌مایند</Styled.MainSwiperTitle>
        {isEmpty(templatesObject) ? (
          <LogoLoader />
        ) : (
          <CustomSwiper
            grabCursor
            scrollbar
            freeMode
            onSliderTransition={handleSliderTransition}
            slidesPerView={3}
            spaceBetween={10}>
            {[...AllTemplates]?.map((template, index) => {
              return (
                <TemplateCard
                  template={template}
                  key={index}
                  onClickCard={handleClickCard}
                  isTransition={isTransition}
                />
              );
            })}
          </CustomSwiper>
        )}
      </Styled.MainContentSwiperSection>
    </div>
  );
};

export default TemplateGalleryMain;
