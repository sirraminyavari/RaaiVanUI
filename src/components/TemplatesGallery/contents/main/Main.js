import { useContext, useState } from 'react';
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
import { decodeBase64, isEmpty, getSystemName } from 'helpers/helpers';
import { parseTemplates } from 'components/TemplatesGallery/templateUtils';
import {
  TemplatesGalleryContext,
  DESCRIPTIONS_CONTENT,
} from 'components/TemplatesGallery/TemplatesGallery';
import { selectApplication } from 'store/slice/applications/selectors';

const TemplateGalleryMain = () => {
  const { RVDic } = useWindow();
  const { currentApp } = useSelector(selectApplication);
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

  //! Search between all templates.
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
            {RVDic.CollectionOfReadyToUseTemplatesForBetterUseOfRaaiVan.replace(
              '[RaaiVan]',
              getSystemName()
            )}
          </Styled.MainContentExcerpt>
          <Styled.MainContentDescription>
            {RVDic.X.TemplatesGalleryDescription}
          </Styled.MainContentDescription>
          <Styled.MainContentInputWrapper>
            <Input
              type="text"
              style={{ width: '100%' }}
              placeholder={RVDic.SearchInN.replace('[n]', RVDic.Templates)}
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
            {RVDic.TemplatesRelatedToN.replace('[n]', searchText)}
          </Styled.MainSwiperTitle>
        ) : (
          <Styled.MainSwiperTitle>
            {RVDic.SuggestedByRaaiVan.replace('[RaaiVan]', getSystemName())}
          </Styled.MainSwiperTitle>
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
            spaceBetween={10}
          >
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
            spaceBetween={10}
          >
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
