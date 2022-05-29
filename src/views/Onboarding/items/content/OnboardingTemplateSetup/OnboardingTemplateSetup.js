import { useHistory } from 'react-router-dom';
import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTemplateSetup.styles';
import CliqMindLogo from 'assets/images/cliqmind_logo_mini.svg?file';
import Button from 'components/Buttons/Button';
import { useEffect, useState } from 'react';
import { useOnboardingTeamContent } from '../../others/OnboardingTeam.context';
import { getTemplateJSON, activateTemplate } from 'apiHelper/ApiHandlers/CNAPI';
import { themeSlice } from 'store/reducers/themeReducer';
import { decodeBase64 } from 'helpers/helpers';
import {
  setOnboardingTemplateStatusCompleted,
  toggleActivation,
} from 'store/reducers/onboardingReducer';
import { useDispatch } from 'react-redux';
import { CLASSES_PATH, MAIN_CONTENT } from 'constant/constants';
import { useThemeSlice } from 'store/slice/theme';
import InfoCircleIcon from 'components/Icons/InfoCircleIcon/InfoIcon';
const { setSidebarContent, toggleSidebar } = themeSlice.actions;

const OnboardingTemplateSetupContent = () => {
  const { RVDic, RVGlobal } = useWindow();
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  const dispatch = useDispatch();
  const { selectedTemplates, applicationID } = useOnboardingTeamContent();

  const {
    actions: { setSidebarContent, toggleSidebar },
  } = useThemeSlice();

  const activateTemplateHandler = async (template, appId) => {
    const { Template } = await getTemplateJSON({
      NodeTypeID: template?.NodeTypeID,
    });
    return activateTemplate({ Template: Template });
  };

  useEffect(() => {
    dispatch(toggleSidebar(true));
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
    dispatch(
      setSidebarContent({
        current: MAIN_CONTENT,
        prev: '',
      })
    );
    history.push(CLASSES_PATH);
  };
  //TODO update RVDic i18n
  //! RVDic i18n localization
  const RVDicOnboardingTemplateSetupUnderstood = RVDic.YesssLetsGo;
  const RVDicOnboardingTemplateSetupNavbarDescriptionTitle = `سایدبار ناوبری کلیک‌مایند`;
  const RVDicOnboardingTemplateSetupNavbarDescription = `.در کلیک مایند سایدبار سمت راست نقش ناوبری کاربر بین دسته‌ها و تمپلیتها را به عهده دارد و راه دسترسی کاربر به آیتم‌های یک تمپلیت از سایدبار است`;
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
      {!isLoading && <Styles.OnboardingTemplateSetupCelebrateAnimation />}

      <Button
        style={{ paddingInline: '4rem' }}
        onClick={goToApplication}
        loading={isLoading}
      >
        {RVDicOnboardingTemplateSetupUnderstood}
      </Button>

      <Styles.OnboardingTemplateSetupDescriptionWrapper>
        <Styles.OnboardingTemplateSetupTitleDescription mediumFontWeight>
          <InfoCircleIcon />
          {RVDicOnboardingTemplateSetupNavbarDescriptionTitle}
        </Styles.OnboardingTemplateSetupTitleDescription>
        <Styles.OnboardingTemplateSetupTitleDescription>
          {RVDicOnboardingTemplateSetupNavbarDescription}
        </Styles.OnboardingTemplateSetupTitleDescription>
      </Styles.OnboardingTemplateSetupDescriptionWrapper>
    </Styles.OnboardingTemplateSetupWrapper>
  );
};

OnboardingTemplateSetupContent.displayName = 'OnboardingTemplateSetupContent';

export default OnboardingTemplateSetupContent;
