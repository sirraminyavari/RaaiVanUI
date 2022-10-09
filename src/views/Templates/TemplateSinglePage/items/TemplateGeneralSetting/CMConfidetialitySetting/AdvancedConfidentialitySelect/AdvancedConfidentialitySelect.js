import * as Styled from '../CMConfidentialitySettingStyle';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';
import CustomSelectIndicator from 'components/Inputs/CustomSelect/items/CustomSelectIndicator';
import { useMemo, useState } from 'react';
import SelectObject from '../SelectObject/SelectObject';
import { usePrivacyProvider } from '../PrivacyContext';
import { useTemplateContext } from '../../../../TemplateProvider';
import MembersPreview from 'components/MembersPreview/MembersPreview';
import { decodeBase64 } from 'helpers/helpers';

const AdvancedConfidentialitySelect = ({ permissionType, label }) => {
  const { handlePermissionTypeSelection, audience } = usePrivacyProvider();

  const { NodeTypeID } = useTemplateContext();

  const members = useMemo(() => {
    return (
      audience?.Items[`${NodeTypeID}`]?.Audience?.filter(
        (x) => x?.PermissionType === permissionType
      )?.map((x) => ({
        id: x?.ObjectID,
        title: decodeBase64(x?.RoleName),
        src: x?.IconURL,
      })) || []
    );
  }, [audience]);

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
        <Styled.SelectorBlock>
          <Styled.CustomizedSelectionContainer>
            {selected === 'CUSTOMIZED' && (
              <>
                <SelectObject type={permissionType} />

                <MembersPreview members={members} size={2.5} maxItems={4} />
              </>
            )}
          </Styled.CustomizedSelectionContainer>
        </Styled.SelectorBlock>
      </Styled.SelectionBlock>
    </>
  );
};
export default AdvancedConfidentialitySelect;
