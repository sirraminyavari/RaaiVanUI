import * as Styled from './InvitaionStyle';
import { useEffect, useState } from 'react';
import CustomSelect from 'components/Inputs/CustomSelect/CustomSelect';
import CustomSelectIndicator from 'components/Inputs/CustomSelect/items/CustomSelectIndicator';
import UserAccessTypeOption from 'components/Inputs/CustomSelect/items/UserAccessTypeOption';

const UserInvitationForm = ({ ...props }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
  });

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
          onChange={(value) => setFormData({ ...formData, email: value })}
          placeholder={'ایمیل'}
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
          placeholder=""
          components={{
            DropdownIndicator: CustomSelectIndicator,
            Option: UserAccessTypeOption,
          }}
          classNamePrefix="select"
          options={userAccessOption}
        />
      </Styled.FieldContainer>
    </Styled.FormContainer>
  );
};
export default UserInvitationForm;
