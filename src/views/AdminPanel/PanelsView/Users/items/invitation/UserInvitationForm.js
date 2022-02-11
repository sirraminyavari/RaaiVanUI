import * as Styled from './InvitaionStyle';
import { useEffect, useState } from 'react';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';
import CustomSelectIndicator from 'components/Inputs/CustomSelect/items/CustomSelectIndicator';
import UserAccessTypeOption from 'components/Inputs/CustomSelect/items/UserAccessTypeOption';
import useWindowContext from 'hooks/useWindowContext';

const UserInvitationForm = ({ onChange, data }) => {
  const { RVDic } = useWindowContext();
  const [formData, setFormData] = useState({
    email: data?.email || '',
    name: data?.name || '',
    access: data?.access || '',
  });

  const setEmail = (value) => {
    setFormData({ ...formData, email: value });
  };

  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData]);

  const userAccessOption = [
    {
      label: 'کاربر عادی',
      value: 'NORMAL',
      description: 'دسترسی به موضوعات غیرمحرمانه',
    },
    {
      label: 'کاربر معتمد',
      value: 'TRUSTED',
      description: 'دسترسی به تمامی موضوعات',
    },
    {
      label: 'مدیر تیم',
      value: 'MANAGER',
      description: 'دسترسی به موضوعات و مدیریت تیم',
    },
  ];

  return (
    <Styled.FormContainer>
      <Styled.EmailContainer>
        <Styled.StyledAnimatedInput
          style={{ flexGrow: 2 }}
          value={formData?.email}
          onChange={setEmail}
          placeholder={RVDic?.Email}
        />
      </Styled.EmailContainer>

      <Styled.FieldContainer>
        <Styled.StyledAnimatedInput
          value={formData?.name}
          onChange={(value) => setFormData({ ...formData, name: value })}
          placeholder={'نام هم‌تیمی (اختیاری)'}
        />
      </Styled.FieldContainer>

      <Styled.FieldContainer>
        <CustomSelect
          defaulValue={{
            value: formData?.access,
            label: userAccessOption?.find((x) => x?.value === formData?.access)
              ?.label,
          }}
          placeholder=""
          components={{
            DropdownIndicator: CustomSelectIndicator,
            Option: UserAccessTypeOption,
          }}
          classNamePrefix="select"
          options={userAccessOption}
          onChange={(e) => setFormData({ ...formData, access: e?.value })}
        />
      </Styled.FieldContainer>
    </Styled.FormContainer>
  );
};
export default UserInvitationForm;
