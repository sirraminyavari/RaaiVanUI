import { useHistory } from 'react-router-dom';
import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTemplateSetup.styles';
import CliqMindLogo from 'assets/images/cliqmind_logo_mini.svg?file';
import Button from 'components/Buttons/Button';
import { useEffect, useState } from 'react';
import { useOnboardingTeamContent } from '../../others/OnboardingTeam.context';
import { getTemplateJSON, activateTemplate } from 'apiHelper/ApiHandlers/CNApi';
import { sidebarMenuSlice } from 'store/reducers/sidebarMenuReducer';
import { decodeBase64 } from 'helpers/helpers';
import {
  setOnboardingTemplateStatusCompleted,
  toggleActivation,
} from 'store/reducers/onboardingReducer';
import { useDispatch } from 'react-redux';
const {
  actions: { toggleSidebarMenu },
} = sidebarMenuSlice;

const OnboardingTemplateSetupContent = () => {
  const { RVDic, RVGlobal } = useWindow();
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  const dispatch = useDispatch();
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
        return () =>
          activateTemplateHandler(template, applicationID).then(() =>
            dispatch(setOnboardingTemplateStatusCompleted(template.NodeTypeID))
          );
      });
      for (let i = 0; i < selectedTemplatesAPICallbacks.length; i++)
        await selectedTemplatesAPICallbacks[i]();
      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplates]);

  const goToApplication = () => {
    dispatch(toggleActivation());
    history.push('/');
  };

  //! RVDic i18n localization
  const RVDicOnboardingTemplateSetupUnderstood = RVDic.YesssLetsGo;
  const RVDicOnboardingTemplateSetupTitle =
    RVDic.AreYouReadyToStartYourJourneyOnRaaiVan.replace(
      '[RaaiVan]',
      decodeBase64(RVGlobal.SystemName)
    );
  return (
    <Styles.OnboardingTemplateSetupWrapper>
      <img src={CliqMindLogo} alt="" />
      <Styles.OnboardingTemplateSetupTitle>
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
