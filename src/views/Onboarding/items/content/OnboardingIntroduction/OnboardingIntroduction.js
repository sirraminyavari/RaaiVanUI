import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useWindow from 'hooks/useWindowContext';
import * as Styles from './OnboardingIntroduction.styles';
import * as GlobalStyles from 'views/Onboarding/items/Onboarding.styles';
import EmojiHello from 'assets/images/emoji-hello.svg';
import { ONBOARDING_USER_INFO_PATH } from '../../others/constants';
import { decodeBase64 } from 'helpers/helpers';

const OnboardingIntroductionContent = () => {
  const [introductionStep, setIntroductionStep] = useState(false);

  const { RVDic, RVGlobal } = useWindow();
  const history = useHistory();

  //TODO add missing RVDic locales
  //! RVDic i18n localization
  const RVDicHelloWorld = 'ســـلام';
  const RVDicWelcomeToCliqMind = RVDic.WelcomeToRaaiVan.replace(
    '[RaaiVan]',
    decodeBase64(RVGlobal.SystemName)
  );

  useEffect(() => {
    setTimeout(() => setIntroductionStep('title'), 100);
    setTimeout(() => setIntroductionStep('title desc'), 2500);
    setTimeout(() => history.push(ONBOARDING_USER_INFO_PATH), 5000);
  }, []);

  return (
    <GlobalStyles.OnboardingFixedLayout>
      <Styles.OnboardingIntroductionWrapper className={introductionStep}>
        <Styles.OnboardingIntroductionText>
          <Styles.WaveContent>
            <Styles.EmojiImage src={EmojiHello} />
          </Styles.WaveContent>
          {RVDicHelloWorld}!
        </Styles.OnboardingIntroductionText>
        <Styles.OnboardingIntroductionText>
          {RVDicWelcomeToCliqMind}
        </Styles.OnboardingIntroductionText>
      </Styles.OnboardingIntroductionWrapper>
    </GlobalStyles.OnboardingFixedLayout>
  );
};

OnboardingIntroductionContent.displayName = 'OnboardingIntroductionContent';

export default OnboardingIntroductionContent;
