import { useContext } from 'react';
import * as Styled from '../../TemplatesGallery.styles';
import CustomSwiper from 'components/CustomSwiper/CustomSwiper';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import Button from 'components/Buttons/Button';
import {
  TemplatesGalleryContext,
  CATEGORY_CONTENT,
  MAIN_CONTENT,
} from '../../TemplatesGallery';
import { decodeBase64 } from 'helpers/helpers';

const TemplateDescription = () => {
  const {
    currentTemplate,
    currentCategory,
    setContent,
    setCurrentTemplate,
  } = useContext(TemplatesGalleryContext);

  const handleReturnClick = () => {
    if (currentCategory) {
      setContent({ name: CATEGORY_CONTENT, data: { currentCategory } });
      setCurrentTemplate(null);
    } else {
      setContent({ name: MAIN_CONTENT, data: {} });
      setCurrentTemplate(null);
    }
  };

  return (
    <PerfectScrollbar className="template-description-scrollbar">
      <Styled.TemplateDescriptionWrapper>
        <Button
          type="negative-o"
          classes="template-back-button"
          onClick={handleReturnClick}>
          بازگشت
        </Button>
        <Styled.TemplateTitleInDescription>
          {decodeBase64(currentTemplate?.TypeName)}
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
                  {decodeBase64(currentTemplate?.TypeName)}
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
          {currentTemplate?.Description || 'Template Description'}
        </Styled.TemplateDescription>
      </Styled.TemplateDescriptionWrapper>
    </PerfectScrollbar>
  );
};

export default TemplateDescription;
