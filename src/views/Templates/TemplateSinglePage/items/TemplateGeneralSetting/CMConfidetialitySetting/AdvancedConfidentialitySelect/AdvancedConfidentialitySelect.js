import * as Styled from '../CMConfidentialitySettingStyle';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';
import CustomSelectIndicator from 'components/Inputs/CustomSelect/items/CustomSelectIndicator';
import { useEffect, useState } from 'react';
import SelectObject from '../SelectObject/SelectObject';
import useCMConfidentiality from '../useCMConfidentiality';
import { usePrivacyProvider } from '../PrivacyContext';
import { PERMISSION_TYPE } from '../../../../../../../apiHelper/ApiHandlers/privacyApi';

const AdvancedConfidentialitySelect = ({ permissionType, label }) => {
  const [selected, setSelected] = useState('');
  const { NodeTypeID, setAdvancedPermissions } = usePrivacyProvider();

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

  const handleSelection = (e) => {
    setSelected(e?.value);
  };

  useEffect(() => {
    (async () => {
      if (selected === 'ALLOWED') {
        const Audience = [
          {
            PermissionType: permissionType,
            Allow: true,
          },
        ];
        await setAdvancedPermissions(Audience);
      } else if (selected === 'DENIED') {
        const Audience = [
          {
            PermissionType: permissionType,
            Allow: true,
          },
        ];
        await setAdvancedPermissions(Audience);
      }
    })();
  }, [selected]);

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

        {selected === 'CUSTOMIZED' && <SelectObject type={permissionType} />}
      </Styled.SelectionBlock>
    </>
  );
};
export default AdvancedConfidentialitySelect;
