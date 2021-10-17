import { useContext, useState } from 'react';
import { createSelector } from 'reselect';
import { useSelector } from 'react-redux';
import CustomSwiper from 'components/CustomSwiper/CustomSwiper';
import TemplateCard from 'components/TemplatesGallery/TemplateCard';
import EmptyTemplateCard from 'components/TemplatesGallery/EmptyTemplateCard';
import useWindow from 'hooks/useWindowContext';
import * as Styled from 'components/TemplatesGallery/TemplatesGallery.styles';
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
} from 'components/TemplatesGallery/TemplatesGallery';

const selectCurrentApp = createSelector(
  (state) => state?.applications,
  (applications) => applications?.currentApp
);

const TemplateGalleryMain = () => {
  const { RVDic } = useWindow();
  const currentApp = useSelector(selectCurrentApp);
  const { templatesObject, setContent, setCurrentTemplate } = useContext(
    TemplatesGalleryContext
  );
  const { AllTemplates } = parseTemplates(templatesObject);

  const [isTransition, setIsTransition] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchList, setSearchList] = useState([]);
  const [searchText, setSearchText] = useState('');

  const { ID: expertiseId, Name: expertiseName } =
    currentApp?.FieldOfExpertise || {};

  // ! Prepare suggestions.
  const cliqMindSuggestions = AllTemplates.filter((template) =>
    template?.Tags.some((tag) => tag?.NodeID === expertiseId)
  );

  //! When user clicks on a card.
  const handleClickCard = (template) => {
    setContent({ name: DESCRIPTIONS_CONTENT, data: { template } });
    setCurrentTemplate(template);
  };

  const handleSliderTransition = (value) => {
    setIsTransition(value);
  };

  //! SearchOld between all templates.
  const handleSearchTemplates = (e) => {
    const searchValue = e.target.value.replace(/\s+/g, '');
    setSearchText(e.target.value);
    if (searchValue.length) {
      const searchedTemplates = AllTemplates?.filter(
        (template) =>
          decodeBase64(template?.TypeName)
            .replace(/[\u200C]/g, '') //! Removes ZERO WIDTH NON-JOINER that use as half space and massively are using in Persian texts.
            .match(searchValue) ||
          template?.Tags.some((tag) =>
            decodeBase64(tag?.Name)
              .replace(/[\u200C]/g, '')
              .match(searchValue)
          )
      );
      setIsSearching(true);
      setSearchList(searchedTemplates);
    } else {
      setIsSearching(false);
      setSearchList([]);
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
              placeholder="جستجو در همه تمپلیت ها"
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
            {`تمپلیت های مرتبط با '${searchText}'`}
          </Styled.MainSwiperTitle>
        ) : (
          <Styled.MainSwiperTitle>پیشنهاد کلیک‌مایند</Styled.MainSwiperTitle>
        )}

        {isEmpty(templatesObject) ? (
          <LogoLoader />
        ) : isSearching ? (
          <CustomSwiper
            grabCursor
            scrollbar
            freeMode
            onSliderTransition={handleSliderTransition}
            slidesPerView={3}
            spaceBetween={10}>
            {searchList?.map((template, index) => {
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
        ) : cliqMindSuggestions.length ? (
          <CustomSwiper
            grabCursor
            scrollbar
            freeMode
            onSliderTransition={handleSliderTransition}
            slidesPerView={3}
            spaceBetween={10}>
            {cliqMindSuggestions?.map((template, index) => {
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
        ) : (
          <EmptyTemplateCard />
        )}
      </Styled.MainContentSwiperSection>
    </div>
  );
};

export default TemplateGalleryMain;
