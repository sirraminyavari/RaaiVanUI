import { useContext, useState, useEffect, useRef } from 'react';
import CustomSwiper from 'components/CustomSwiper/CustomSwiper';
import TemplateCard from '../../TemplateCard';
import useWindow from 'hooks/useWindowContext';
import * as Styled from '../../TemplatesGallery.styles';
import GalleryMainImage from 'assets/images/template-gallery.svg';
import Input from 'components/Inputs/Input';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import { CV_DISTANT, CV_WHITE } from 'constant/CssVariables';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import { decodeBase64, isEmpty } from 'helpers/helpers';
import { parseTemplates } from 'components/TemplatesGallery/templateUtils';
import {
  TemplatesGalleryContext,
  DESCRIPTIONS_CONTENT,
} from '../../TemplatesGallery';

const TemplateGalleryMain = () => {
  const { RVDic } = useWindow();
  const { templatesObject, setContent, setCurrentTemplate } = useContext(
    TemplatesGalleryContext
  );
  const parsedTemplates = parseTemplates(templatesObject);
  const { AllTemplates } = parsedTemplates || {};

  const [isTransition, setIsTransition] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [swiperList, setSwiperList] = useState([]);
  const suggestionListRef = useRef();

  useEffect(() => {
    if (AllTemplates.length) {
      setSwiperList(AllTemplates);
      suggestionListRef.current = AllTemplates;
    }
  }, [AllTemplates]);

  const handleClickCard = (template) => {
    setContent({ name: DESCRIPTIONS_CONTENT, data: { template } });
    setCurrentTemplate(template);
  };

  const handleSliderTransition = (value) => {
    setIsTransition(value);
  };

  const handleSearchTemplates = (e) => {
    const searchValue = e.target.value;
    if (searchValue.length) {
      const searchedTemplates = AllTemplates?.filter(
        (template) =>
          decodeBase64(template?.TypeName).match(searchValue) ||
          template?.Tags.some((tag) =>
            decodeBase64(tag?.Name).match(searchValue)
          )
      );
      setSwiperList(searchedTemplates);
      setIsSearching(true);
    } else {
      setIsSearching(false);
      setSwiperList(suggestionListRef.current);
    }
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
              onChange={handleSearchTemplates}
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
        {isSearching ? (
          <Styled.MainSwiperTitle>
            <Styled.SwiperTitleIcon>
              <SearchIcon size={18} color={CV_WHITE} />
            </Styled.SwiperTitleIcon>
            تمپلیت‌های مرتبط با عنوان عبارت جستجو شده
          </Styled.MainSwiperTitle>
        ) : (
          <Styled.MainSwiperTitle>پیشنهاد کلیک‌مایند</Styled.MainSwiperTitle>
        )}

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
            {swiperList?.map((template, index) => {
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
