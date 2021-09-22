import { useContext, useState } from 'react';
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
import useWindow from 'hooks/useWindowContext';
import { activateTemplate, getTemplatesJSON } from 'apiHelper/apiFunctions';
import InfoToast from 'components/toasts/info-toast/InfoToast';

const TemplateDescription = () => {
  const {
    currentTemplate,
    currentCategory,
    setContent,
    setCurrentTemplate,
  } = useContext(TemplatesGalleryContext);
  const { RVDic } = useWindow();
  const [isActivating, setIsActivating] = useState(false);

  /**
   * Make a toast for template activation status.
   * @param {string} message -Toast message
   * @param {('info' | 'error')} type -Toast type
   * @returns
   */
  const makeToast = (message, type) => {
    return InfoToast({
      autoClose: true,
      type,
      message,
      toastId: `template-activation-${currentTemplate?.NodeTypeID}`,
    });
  };

  //! Back to the last state in gallery.
  const handleReturnClick = () => {
    if (currentCategory) {
      setContent({ name: CATEGORY_CONTENT, data: { currentCategory } });
      setCurrentTemplate(null);
    } else {
      setContent({ name: MAIN_CONTENT, data: {} });
      setCurrentTemplate(null);
    }
  };

  //! Template activation process.
  const handleActivateTemplate = () => {
    setIsActivating(true);

    //! First, get template json.
    getTemplatesJSON(currentTemplate?.NodeTypeID)
      .then((response) => {
        if (response?.Template) {
          //! Then, activate the template.
          activateTemplate(response?.Template)
            .then((res) => {
              console.log(res);
              setIsActivating(false);
              if (res?.Succeed) {
                //! send success toast.
                const successMSG = `قالب "${decodeBase64(
                  currentTemplate?.TypeName
                )}" فعال شد`;
                makeToast(successMSG, 'info');
              }

              if (res?.ErrorText) {
                //! send error toast.
                const errorMSG = RVDic.MSG[res?.ErrorText] || res?.ErrorText;
                makeToast(errorMSG, 'error');
              }
            })
            .catch((err) => {
              setIsActivating(false);
              console.log(err);
              //! send error toast.
              makeToast(err.message, 'error');
            });
        }
      })
      .catch((error) => {
        setIsActivating(false);
        console.log(error);
        //! send error toast.
        makeToast(error.message, 'error');
      });
  };

  return (
    <PerfectScrollbar className="template-description-scrollbar">
      <Styled.TemplateDescriptionWrapper>
        <Button
          type="negative-o"
          classes="template-back-button"
          onClick={handleReturnClick}>
          {RVDic.Return}
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
                <Styled.TemplatePhotoContainer key={index}>
                  {decodeBase64(currentTemplate?.TypeName)}
                </Styled.TemplatePhotoContainer>
              );
            })}
          </CustomSwiper>
        </Styled.TemplatePhotosWrapper>
        <Button
          loading={isActivating}
          onClick={handleActivateTemplate}
          classes="activate-template-button">
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
