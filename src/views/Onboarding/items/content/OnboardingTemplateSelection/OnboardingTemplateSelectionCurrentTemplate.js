import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTemplateSelection.styles';
import Button from 'components/Buttons/Button';
import { useEffect } from 'react';
import { getTemplates } from 'apiHelper/ApiHandlers/CNApi';

const OnboardingTemplateSelectionCurrentTemplate = () => {
  const { RVDic } = useWindow();

  useEffect(() => {
    // const ress = getTemplateJSON({
    //   NodeTypeID: '2e36f09f-b76c-4c41-bb53-1f256a5adbe8',
    // });
    // ress.then((res) => console.log({ res }));
    getTemplates({ TagID: 'd1e73967-8360-4f96-9bcc-9156aa68aad7' }).then(
      (res) => {
        console.log({ cTag: res });
      }
    );
  }, []);

  //TODO add missing RVDic locales
  //! RVDic i18n localization
  const RVDicOnboardingTemplatePlaceholder = 'بازدید از نمایشگاه';
  const RVDicOnboardingSelectTemplate = 'انتخاب تمپلیت';
  const RVDicOnboardingTemplateTextPlaceholder1 =
    'شرکت ها و سازمان ها سالانه به دفعات از نمایشگاه های داخلی و خارجی بازدید می کنند؛ اما دستاورد آن ها از این نمایشگاه ها مجموعه محدودی از مستندات و تعدادی گفتگوی سرپایی است که بعد از مدتی فراموش می شود. پس از آن نه دیگران نه حتی خود فرد یا افراد شرکت کننده اطلاعات و مستندات دقیقی از این که در نمایشگاه چه گذشته، با چه مجموعه ها و افرادی آشنا شده اند یا از آن چه چیزهایی آموخته اند در اختیار ندارند و این چرخه در سازمان ادامه دارد.';
  const RVDicOnboardingTemplateTextPlaceholder2 =
    'نمایشگاه های عمومی و تخصصی مملو از فرصت های آشنایی با شرکت ها، محصولات، خدمات، ایده ها و افراد جدید است. این موارد می تواند به توسعه کسب و کار، توسعه محصولات جدید، آگاهی از فعالیت رقبا یا پیدا کردن شرکا تجاری جدید منجر شود.';

  return (
    <>
      <div>
        <Styles.OnboardingTemplateSelectionImage src="/images/preview.png" />
        <Styles.OnboardingTemplateSelectionCurrentTemplateTitle>
          {RVDicOnboardingTemplatePlaceholder}
        </Styles.OnboardingTemplateSelectionCurrentTemplateTitle>
        <Styles.OnboardingTemplateSelectionCurrentTemplateParagraph>
          {RVDicOnboardingTemplateTextPlaceholder1}
        </Styles.OnboardingTemplateSelectionCurrentTemplateParagraph>
        <Styles.OnboardingTemplateSelectionCurrentTemplateParagraph>
          {RVDicOnboardingTemplateTextPlaceholder2}
        </Styles.OnboardingTemplateSelectionCurrentTemplateParagraph>
        <Styles.OnboardingTemplateSelectionButtonWrapper
          style={{ marginBlockStart: '4rem' }}
        >
          <Button style={{ paddingInline: '2rem' }} type="primary-o">
            {RVDicOnboardingSelectTemplate}
          </Button>
        </Styles.OnboardingTemplateSelectionButtonWrapper>
      </div>
    </>
  );
};

OnboardingTemplateSelectionCurrentTemplate.displayName =
  'OnboardingTemplateSelectionCurrentTemplate';

export default OnboardingTemplateSelectionCurrentTemplate;
