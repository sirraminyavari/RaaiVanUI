import { useContext, useState } from 'react';
import * as Styled from '../../TemplatesGallery.styles';
import ScrollBarProvider from 'components/ScrollBarProvider/ScrollBarProvider';
import Button from 'components/Buttons/Button';
import {
  TemplatesGalleryContext,
  CATEGORY_CONTENT,
  MAIN_CONTENT,
} from '../../TemplatesGallery';
import { decodeBase64 } from 'helpers/helpers';
import useWindow from 'hooks/useWindowContext';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import LottieMaker from 'components/LottieMaker/LottieMaker';
import LottieJson from 'assets/lotties/big-data-analysis.json';
import Heading from 'components/Heading/Heading';
import { CLASSES_PATH } from 'constant/constants';
import {
  activateTemplate,
  getTemplateJSON,
} from 'apiHelper/ApiHandlers/CNAPI/CNApi';

const TemplateDescription = () => {
  const { currentTemplate, currentCategory, setContent, setCurrentTemplate } =
    useContext(TemplatesGalleryContext);

  const { RVDic } = useWindow();
  const [isActivating, setIsActivating] = useState(false);

  /**
   * Make a toast for template activation status.
   * @param {string} message -Toast message
   * @param {('info' | 'error')} type -Toast type
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
  const handleActivateTemplate = async () => {
    setIsActivating(true);

    //first, get the template object
    const response = await getTemplateJSON({
      NodeTypeID: currentTemplate?.NodeTypeID,
    });

    //then, activate the template
    const acRes = !response?.Template
      ? null
      : await activateTemplate({ Template: response.Template });

    setIsActivating(false);

    if (acRes?.Succeed) {
      //! send success toast.
      const successMSG = RVDic.MSG.TemplateNActivated.replace(
        '[n]',
        decodeBase64(currentTemplate?.TypeName)
      );

      makeToast(successMSG, 'info');

      setTimeout(() => (window.location.href = CLASSES_PATH), 1000);
    } else if (acRes?.ErrorText || response?.ErrorText) {
      //! send error toast.
      const errorMSG =
        RVDic.MSG[acRes?.ErrorText || response?.ErrorText] ||
        acRes?.ErrorText ||
        response?.ErrorText;
      makeToast(errorMSG, 'error');
    }
  };

  return (
    <ScrollBarProvider>
      <Styled.TemplateDescriptionWrapper>
        <Button
          type="negative-o"
          classes="template-back-button"
          onClick={handleReturnClick}
        >
          {RVDic.Return}
        </Button>
        <Styled.TemplateTitleInDescription>
          {decodeBase64(currentTemplate?.TypeName)}
        </Styled.TemplateTitleInDescription>
        <LottieMaker animationJSON={LottieJson} loop autoplay width={'12rem'} />
        <Heading type="h4">
          *#* تمپلیت های قابل ویرایش را بزودی در همین صفحه خواهید دید!
        </Heading>
        {/* <Styled.TemplatePhotosWrapper>
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
        </Styled.TemplatePhotosWrapper> */}
        <Button
          loading={isActivating}
          onClick={handleActivateTemplate}
          classes="activate-template-button"
        >
          {RVDic.UseThisN.replace('[n]', RVDic.Template)}
        </Button>
        {!!currentTemplate?.Description && (
          <Styled.TemplateDescription>
            {decodeBase64(currentTemplate.Description)}
          </Styled.TemplateDescription>
        )}
      </Styled.TemplateDescriptionWrapper>
    </ScrollBarProvider>
  );
};

export default TemplateDescription;
