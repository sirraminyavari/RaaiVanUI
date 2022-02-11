import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingIntroduction.styles';
import { ONBOARDING_USER_INFO_PATH } from '../../others/constants';

const OnboardingIntroductionContent = () => {
  const [introductionStep, setIntroductionStep] = useState(false);

  const { RVDic } = useWindow();
  const history = useHistory();

  //TODO add missing RVDic locales
  //! RVDic i18n localization
  const RVDicWelcomeToCliqMind = RVDic.WelcomeToRaaiVan.replace(
    '[RaaiVan]',
    RVDic.CliqMind
  );

  useEffect(() => {
    setTimeout(() => setIntroductionStep('title'), 100);
    setTimeout(() => setIntroductionStep('title desc'), 2500);
    setTimeout(() => history.push(ONBOARDING_USER_INFO_PATH), 5000);
  }, []);

  return (
    <Styles.OnboardingIntroductionWrapper className={introductionStep}>
      <Styles.OnboardingIntroductionText>
        <Styles.WaveContent>👋</Styles.WaveContent>
        ســـلام!
      </Styles.OnboardingIntroductionText>
      <Styles.OnboardingIntroductionText>
        {RVDicWelcomeToCliqMind}
      </Styles.OnboardingIntroductionText>
    </Styles.OnboardingIntroductionWrapper>
  );
};

OnboardingIntroductionContent.displayName = 'OnboardingIntroductionContent';

export default OnboardingIntroductionContent;
