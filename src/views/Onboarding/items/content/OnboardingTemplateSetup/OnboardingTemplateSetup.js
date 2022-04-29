import { useHistory } from 'react-router-dom';
import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTemplateSetup.styles';
import CliqMindLogo from 'assets/images/cliqmind_logo_mini.svg?file';
import Button from 'components/Buttons/Button';
import { useEffect, useState } from 'react';
import { useOnboardingTeamContent } from '../../others/OnboardingTeam.context';
import { getTemplateJSON, activateTemplate } from 'apiHelper/ApiHandlers/CNApi';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
const {
  actions: { toggleSidebarMenu },
} = sidebarMenuSlice;

const OnboardingTemplateSetupContent = () => {
  const { RVDic } = useWindow();
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  const { selectedTemplates, applicationID } = useOnboardingTeamContent();

  const activateTemplateHandler = async (template, appId) => {
    const { Template } = await getTemplateJSON({
      NodeTypeID: template?.NodeTypeID,
    });
    return activateTemplate({ Template: Template });
  };

  useEffect(() => {
    toggleSidebarMenu();
    (async () => {
      const selectedTemplatesAPICallbacks = Object.values(
        selectedTemplates
      ).map((template) => {
        return () => activateTemplateHandler(template, applicationID);
      });
      for (let i = 0; i < selectedTemplatesAPICallbacks.length; i++)
        await selectedTemplatesAPICallbacks[i]();
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplates]);

  const goToApplication = () => history.push('/');

  //TODO add missing RVDic locales
  //! RVDic i18n localization
  const RVDicOnboardingTemplateSetupUnderstood = '!آرررره! بزن بریم';
  const RVDicOnboardingTemplateSetupTitle =
    'آماده‌ای بریم توی محیط کلیک‌مایند؟';
  return (
    <Styles.OnboardingTemplateSetupWrapper>
      <img src={CliqMindLogo} alt="" />
      <Styles.OnboardingTemplateSetupTitle type="H1">
        {RVDicOnboardingTemplateSetupTitle}
      </Styles.OnboardingTemplateSetupTitle>

      <Button
        style={{ paddingInline: '4rem' }}
        onClick={goToApplication}
        loading={isLoading}
      >
        {RVDicOnboardingTemplateSetupUnderstood}
      </Button>
    </Styles.OnboardingTemplateSetupWrapper>
  );
};

OnboardingTemplateSetupContent.displayName = 'OnboardingTemplateSetupContent';

export default OnboardingTemplateSetupContent;
