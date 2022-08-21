import Cookie from 'js-cookie';
import useWindow from 'hooks/useWindowContext';
import IranFlag from 'assets/images/emojis/flag-iran_1f1ee-1f1f7.png';
import USFlag from 'assets/images/emojis/flag-united-states_1f1fa-1f1f8.png';
import styled from 'styled-components';
import BinaryInputField from 'components/FormElements/ElementTypes/binary/BinaryInputField';

function LanguageSwitch() {
  const { RVDic, RV_Lang } = useWindow();

  const RVDicEnglishLabel = RVDic.X.Language.English;
  const RVDicPersianLabel = RVDic.X.Language.Farsi;

  const handleLanguageSwitch = (bitValue: boolean) => {
    const langCode = bitValue ? 'en' : 'fa';
    Cookie.set('rv_lang', langCode);
    window.location.reload();
  };

  return (
    <>
      <FlagContainer>
        <BinaryInputField
          isEditable
          isFocused
          value={RV_Lang === 'en'}
          noLabel={
            <LanguageItem flagURL={IranFlag} label={RVDicPersianLabel} />
          }
          yesLabel={<LanguageItem flagURL={USFlag} label={RVDicEnglishLabel} />}
          onChange={({ value }) => handleLanguageSwitch(value)}
        />
      </FlagContainer>
    </>
  );
}
LanguageSwitch.displayName = 'LanguageSwitchComponent';
export default LanguageSwitch;

const LanguageItem = ({ flagURL, label }) => {
  return (
    <FlagContainer>
      <FlagIcon src={flagURL} />
      <span>{label}</span>
    </FlagContainer>
  );
};

const FlagIcon = styled.img`
  height: 1.5rem;
  margin: 0.5rem;
`;
const FlagContainer = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
  align-items: center;
  justify-content: center;
  width: 95%;
  border-radius: 0.8rem;
`;
