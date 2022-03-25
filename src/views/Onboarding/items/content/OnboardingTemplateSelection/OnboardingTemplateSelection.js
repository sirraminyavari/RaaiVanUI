import { useHistory } from 'react-router-dom';
import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTemplateSelection.styles';
import OnboardingTemplateSelectionGallery from './OnboardingTemplateSelectionGallery';
import OnboardingTemplateSelectionCurrentTemplate from './OnboardingTemplateSelectionCurrentTemplate';
import OnboardingTemplateSelectionNode from './OnboardingTemplateSelectionNode';
import OnboardingTemplateSelectionCarousel from './OnboardingTemplateSelectionCarousel';
import Button from 'components/Buttons/Button';
import { getTemplates } from 'apiHelper/ApiHandlers/CNApi';
import { parseTemplates } from 'components/TemplatesGallery/templateUtils.js';
import { useEffect, useMemo, useState } from 'react';
import { useOnboardingTeamContent } from 'views/Onboarding/items/others/OnboardingTeam.context';
import { ONBOARDING_TEMPLATE_SETUP_PATH } from 'views/Onboarding/items/others/constants';

const OnboardingTemplateSelectionContent = () => {
  const [templates, setTemplates] = useState([]);
  const [activateTemplate, setActivateTemplate] = useState();
  const [activeTag, setActiveTag] = useState();
  const { RVDic } = useWindow();
  const history = useHistory();
  const {
    disableContinue,
    selectedTemplates,
    teamState: { workField },
  } = useOnboardingTeamContent();
  useEffect(() => {
    const templateTagID =
      workField.fieldID !== 'OTHERS' ? workField?.fieldID : undefined;
    getTemplates({ TagID: templateTagID }).then((res) => {
      const parsedTemplates = parseTemplates(res);
      setTemplates(parsedTemplates);
      if (parsedTemplates?.AllTemplates.length) {
        setActivateTemplate(parsedTemplates.AllTemplates[0]);
      }
    });
  }, []);

  const gotoTemplateSetup = () => history.push(ONBOARDING_TEMPLATE_SETUP_PATH);

  const selectedTemplateCount = useMemo(() => {
    const selectedTemplateKeys = Object.keys(selectedTemplates);
    return selectedTemplateKeys.length;
  }, [selectedTemplates]);

  //TODO add missing RVDic locales
  //! RVDic i18n localization
  const RVDicSaveAndNext = RVDic.SaveAndNext;
  const RVDicSelectedTemplates = 'تمپلیت انتخاب شده';
  const RVDicUseDefaultTemplates = `!از تمپلیت‌های پیش‌فرض استفاده کن`;
  return (
    <Styles.OnboardingTemplateSelectionWrapper>
      <OnboardingTemplateSelectionGallery
        templates={templates}
        setActiveTag={setActiveTag}
        activateTemplate={setActivateTemplate}
      />
      <div>
        <Styles.OnboardingTemplateSelectionTemplatePanel>
          <OnboardingTemplateSelectionCurrentTemplate
            activeTemplate={activateTemplate}
          />
          <OnboardingTemplateSelectionNode />
        </Styles.OnboardingTemplateSelectionTemplatePanel>
        <OnboardingTemplateSelectionCarousel
          templates={activeTag ? activeTag.Templates : templates?.AllTemplates}
          activateTemplate={setActivateTemplate}
          activeTemplate={activateTemplate}
        />
        <Styles.OnboardingTemplateSelectionButtonWrapper>
          <Button
            style={{ paddingInline: '3rem' }}
            disable={disableContinue}
            onClick={gotoTemplateSetup}
          >
            {RVDicSaveAndNext}
          </Button>
          {selectedTemplateCount ? (
            <Styles.OnboardingTemplateSelectionTemplateCount>
              {selectedTemplateCount} {RVDicSelectedTemplates}
            </Styles.OnboardingTemplateSelectionTemplateCount>
          ) : (
            <Button style={{ paddingInline: '1rem' }} type="primary-o">
              {RVDicUseDefaultTemplates}
            </Button>
          )}
        </Styles.OnboardingTemplateSelectionButtonWrapper>
      </div>
    </Styles.OnboardingTemplateSelectionWrapper>
  );
};

OnboardingTemplateSelectionContent.displayName =
  'OnboardingTemplateSelectionContent';

export default OnboardingTemplateSelectionContent;
