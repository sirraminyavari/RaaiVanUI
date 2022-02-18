import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingTeam.styles';
import Heading from 'components/Heading/Heading';
import LEGALImage from './OnboardingWorkFieldAssets/LEGAL.png';
import EDUCATIONALImage from './OnboardingWorkFieldAssets/EDUCATIONAL.png';
import HRImage from './OnboardingWorkFieldAssets/HR.png';
import MANUFACTURINGImage from './OnboardingWorkFieldAssets/MANUFACTURING.png';
import MARKETINGImage from './OnboardingWorkFieldAssets/MARKETING.png';
import DEVELOPMENTImage from './OnboardingWorkFieldAssets/DEVELOPMENT.png';
import DESIGNImage from './OnboardingWorkFieldAssets/DESIGN.png';
import OTHERSImage from './OnboardingWorkFieldAssets/OTHERS.png';
import PanelButton from 'components/Buttons/PanelButton';
import {
  useOnboardingTeamContent,
  OnboardingTeamStepContextActions,
} from 'views/Onboarding/items/others/OnboardingTeam.context';

const OnboardingTeamCreationSetWorkFieldContent = () => {
  const { RVDic } = useWindow();
  const {
    dispatch: dispatchTeamPage,
    teamState: { workField },
  } = useOnboardingTeamContent();

  //TODO add missing RVDic locales
  //! RVDic i18n localization
  const RVDicِTeamWorkFieldHeadCount = `حوزه فعالیت تیم شما`;
  const RVDicLegalField = `اداری و حقوقی`;
  const RVDicEducationalField = `آموزش`;
  const RVDicHRField = `منابع انسانی`;
  const RVDicManufacturingField = `عملیات و تولید`;
  const RVDicMarketingField = `فروش و بازاریابی`;
  const RVDicDevelopmentField = `توسعه نرم افزار`;
  const RVDicDesignField = `طراحی`;
  const RVDicOthersField = `سایر`;

  const setOnboardingTeamWorkFieldCount = (workField) => () => {
    dispatchTeamPage({
      type: OnboardingTeamStepContextActions.ONBOARDING_TEAM_SET_STATE,
      stateKey: 'workField',
      stateValue: workField,
    });
  };

  return (
    <>
      <Heading type="h2">{RVDicِTeamWorkFieldHeadCount}</Heading>
      <Styles.OnboardingTeamButtonInputWrapper>
        <PanelButton
          secondary
          active={workField === 'LEGAL'}
          onClick={setOnboardingTeamWorkFieldCount('LEGAL')}
        >
          <img src={LEGALImage} size={'1em'} />
          {RVDicLegalField}
        </PanelButton>
        <PanelButton
          secondary
          active={workField === 'EDUCATIONAL'}
          onClick={setOnboardingTeamWorkFieldCount('EDUCATIONAL')}
        >
          <img src={EDUCATIONALImage} size={'1em'} />
          {RVDicEducationalField}
        </PanelButton>
        <PanelButton
          secondary
          active={workField === 'HR'}
          onClick={setOnboardingTeamWorkFieldCount('HR')}
        >
          <img src={HRImage} size={'1em'} />
          {RVDicHRField}
        </PanelButton>
        <PanelButton
          secondary
          active={workField === 'MANUFACTURING'}
          onClick={setOnboardingTeamWorkFieldCount('MANUFACTURING')}
        >
          <img src={MANUFACTURINGImage} size={'1em'} />
          {RVDicManufacturingField}
        </PanelButton>
        <PanelButton
          secondary
          active={workField === 'MARKETING'}
          onClick={setOnboardingTeamWorkFieldCount('MARKETING')}
        >
          <img src={MARKETINGImage} size={'1em'} />
          {RVDicMarketingField}
        </PanelButton>
        <PanelButton
          secondary
          active={workField === 'DEVELOPMENT'}
          onClick={setOnboardingTeamWorkFieldCount('DEVELOPMENT')}
        >
          <img src={DEVELOPMENTImage} size={'1em'} />
          {RVDicDevelopmentField}
        </PanelButton>
        <PanelButton
          secondary
          active={workField === 'DESIGN'}
          onClick={setOnboardingTeamWorkFieldCount('DESIGN')}
        >
          <img src={DESIGNImage} size={'1em'} />
          {RVDicDesignField}
        </PanelButton>
        <PanelButton
          secondary
          active={workField === 'OTHERS'}
          onClick={setOnboardingTeamWorkFieldCount('OTHERS')}
        >
          <img src={OTHERSImage} size={'1em'} />
          {RVDicOthersField}
        </PanelButton>
      </Styles.OnboardingTeamButtonInputWrapper>
    </>
  );
};

OnboardingTeamCreationSetWorkFieldContent.displayName =
  'OnboardingTeamCreationSetWorkFieldContent';

export default OnboardingTeamCreationSetWorkFieldContent;
