import Cookie from 'js-cookie';
import useWindow from 'hooks/useWindowContext';
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
          noLabel={<LanguageItem label={RVDicPersianLabel} />}
          yesLabel={<LanguageItem label={RVDicEnglishLabel} />}
          onChange={({ value }) => handleLanguageSwitch(value)}
        />
      </FlagContainer>
    </>
  );
}
LanguageSwitch.displayName = 'LanguageSwitchComponent';
export default LanguageSwitch;

const LanguageItem = ({ label }) => {
  return (
    <FlagContainer>
      <span>{label}</span>
    </FlagContainer>
  );
};

const FlagContainer = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 0.8rem;

  & > div {
    width: 100%;

    & > div {
      &:first-of-type,
      &:last-of-type {
        padding: 0.4rem;
      }
    }
  }
`;
