import * as Styled from '../CMConfidentialitySettingStyle';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';
import CustomSelectIndicator from 'components/Inputs/CustomSelect/items/CustomSelectIndicator';
import { useState } from 'react';
import SelectObject from '../SelectObject/SelectObject';
import { usePrivacyProvider } from '../PrivacyContext';
import { useTemplateContext } from '../../../../TemplateProvider';

const AdvancedConfidentialitySelect = ({ permissionType, label }) => {
  const { handlePermissionTypeSelection, audience } = usePrivacyProvider();
  const { NodeTypeID } = useTemplateContext();
  const [selected, setSelected] = useState(() => {
    const Audience = audience?.Items[`${NodeTypeID}`]?.Audience;

    const hasAudience = Audience.some(
      (x) => x?.PermissionType === permissionType
    );

    if (hasAudience) {
      return 'CUSTOMIZED';
    } else {
      const defaultValue = audience?.Items[
        `${NodeTypeID}`
      ]?.DefaultPermissions?.find(
        (x) => x?.PermissionType === permissionType
      )?.DefaultValue;

      return defaultValue === 'Public' ? 'ALLOWED' : 'DENIED';
    }
  });

  const options = [
    {
      value: 'ALLOWED',
      label: 'برای همه اعضای تیم',
    },
    {
      value: 'DENIED',
      label: 'فقط مدیران تیم',
    },
    {
      value: 'CUSTOMIZED',
      label: 'انتخاب از لیست اعضای تیم',
    },
  ];

  const handleSelection = async (e) => {
    if (e?.value === 'ALLOWED') {
      await handlePermissionTypeSelection(permissionType, true);
    } else if (e?.value === 'DENIED') {
      await handlePermissionTypeSelection(permissionType, false);
    } else if (e?.value === 'CUSTOMIZED') {
    }
    setSelected(e?.value);
  };

  return (
    <>
      <Styled.SelectionBlock>
        <Styled.BlockTitle>{label}</Styled.BlockTitle>
        <Styled.BlockSelectWrapper>
          <CustomSelect
            defaultValue={{
              value: selected,
              label: options?.find((x) => x?.value === selected)?.label,
            }}
            placeholder=""
            components={{
              DropdownIndicator: CustomSelectIndicator,
            }}
            classNamePrefix="select"
            options={options}
            onChange={handleSelection}
          />
        </Styled.BlockSelectWrapper>

        <Styled.CustomizedSelectionContainer>
          {selected === 'CUSTOMIZED' && <SelectObject type={permissionType} />}
        </Styled.CustomizedSelectionContainer>
      </Styled.SelectionBlock>
    </>
  );
};
export default AdvancedConfidentialitySelect;
