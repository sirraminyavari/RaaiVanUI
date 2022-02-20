import { useEffect, useState } from 'react';
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
import AnimatedInput from 'components/Inputs/AnimatedInput';
import {
  useOnboardingTeamContent,
  OnboardingTeamStepContextActions,
} from 'views/Onboarding/items/others/OnboardingTeam.context';

const OnboardingTeamCreationSetWorkFieldContent = () => {
  const [otherWorkFieldInput, setOtherWorkFieldInput] = useState('');

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
  const RVDicOthersInputField = `نام حوزه کاری خود را بنویسید`;

  const setOnboardingTeamWorkField = (workField) => () => {
    dispatchTeamPage({
      type: OnboardingTeamStepContextActions.ONBOARDING_TEAM_SET_STATE,
      stateKey: 'workField',
      stateValue: workField,
    });
  };

  const workFields = [
    { id: 'LEGAL', imageSrc: LEGALImage, text: RVDicLegalField },
    {
      id: 'EDUCATIONAL',
      imageSrc: EDUCATIONALImage,
      text: RVDicEducationalField,
    },
    {
      id: 'HR',
      imageSrc: HRImage,
      text: RVDicHRField,
    },
    {
      id: 'MANUFACTURING',
      imageSrc: MANUFACTURINGImage,
      text: RVDicManufacturingField,
    },
    {
      id: 'MARKETING',
      imageSrc: MARKETINGImage,
      text: RVDicMarketingField,
    },
    {
      id: 'DEVELOPMENT',
      imageSrc: DEVELOPMENTImage,
      text: RVDicDevelopmentField,
    },
    {
      id: 'DESIGN',
      imageSrc: DESIGNImage,
      text: RVDicDesignField,
    },
  ];

  return (
    <>
      <Heading type="h2">{RVDicِTeamWorkFieldHeadCount}</Heading>
      <Styles.OnboardingTeamButtonInputWrapper wrap>
        {workFields.map(({ id, text, imageSrc }) => (
          <>
            <PanelButton
              secondary
              active={workField === id}
              onClick={setOnboardingTeamWorkField(id)}
            >
              <img src={imageSrc} size={'1em'} />
              {text}
            </PanelButton>
          </>
        ))}

        <PanelButton
          secondary
          active={workField === 'OTHERS'}
          onClick={setOnboardingTeamWorkField('OTHERS')}
        >
          <img src={OTHERSImage} size={'1em'} />
          {RVDicOthersField}
        </PanelButton>
        {workField.startsWith('OTHERS') && (
          <Styles.OnboardingTeamSetWorkFieldInputWrapper>
            <AnimatedInput
              placeholder={RVDicOthersInputField}
              value={otherWorkFieldInput}
              onChange={setOtherWorkFieldInput}
            />
          </Styles.OnboardingTeamSetWorkFieldInputWrapper>
        )}
      </Styles.OnboardingTeamButtonInputWrapper>
    </>
  );
};

OnboardingTeamCreationSetWorkFieldContent.displayName =
  'OnboardingTeamCreationSetWorkFieldContent';

export default OnboardingTeamCreationSetWorkFieldContent;
