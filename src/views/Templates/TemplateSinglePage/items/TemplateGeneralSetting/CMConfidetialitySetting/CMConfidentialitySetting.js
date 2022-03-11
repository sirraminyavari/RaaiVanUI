import * as Styled from './CMConfidentialitySettingStyle';
import CustomSelectIndicator from 'components/Inputs/CustomSelect/items/CustomSelectIndicator';
import UserAccessTypeOption from 'components/Inputs/CustomSelect/items/UserAccessTypeOption';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';
import { useCMConfidentiality } from './useCMConfidentiality';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import LockIcon from 'components/Icons/LockIcon/LockIcon';
import AdvancedConfidentialitySelect from './AdvancedConfidentialitySelect/AdvancedConfidentialitySelect';
import { AdvancedSelectionContainer } from './CMConfidentialitySettingStyle';

const CMConfidentialitySetting = ({ type }) => {
  const { options, loading, selectedOption, handleSelection, advancedOption } =
    useCMConfidentiality({ type });

  if (loading) return <LogoLoader />;

  return (
    <>
      <Styled.Container>
        <Styled.SelectionBlock>
          <Styled.BlockTitle>{'تنظیمات محرمانگی'}</Styled.BlockTitle>
          <Styled.BlockSelectWrapper>
            <CustomSelect
              defaultValue={{
                value: selectedOption,
                label: options?.find((x) => x?.value === selectedOption)?.label,
              }}
              placeholder=""
              components={{
                DropdownIndicator: CustomSelectIndicator,
                Option: UserAccessTypeOption,
              }}
              classNamePrefix="select"
              options={options}
              onChange={handleSelection}
            />
          </Styled.BlockSelectWrapper>
        </Styled.SelectionBlock>
      </Styled.Container>

      {selectedOption === 'CLASSIFIED' && (
        <Styled.MessageContainer>
          <div>
            <LockIcon size={14} />
          </div>
          <div>
            {'آیتم‌های محرمانه فقط برای مدیران قابل مشاهده و ویرایش است.'}
          </div>
        </Styled.MessageContainer>
      )}

      <AdvancedSelectionContainer>
        {selectedOption === 'ADVANCED' &&
          [...advancedOption].map((x) => (
            <AdvancedConfidentialitySelect {...x} />
          ))}
      </AdvancedSelectionContainer>
    </>
  );
};
export default CMConfidentialitySetting;