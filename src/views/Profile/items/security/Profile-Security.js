import * as Styled from 'views/Profile/Profile.styles';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import ChangePasswordContent from './ChangePassword';
import TwoFactorAuthContent from './TwoFactorAuth';
import { USER_PATH } from 'constant/constants';

const ProfileSecurity = () => {
  const breadcrumbItems = [
    { id: 1, title: 'حساب کاربری', linkTo: USER_PATH },
    { id: 2, title: 'ورود  و امنیت', linkTo: '#' },
  ];
  return (
    <Styled.ProfileViewContainer>
      <Breadcrumb items={breadcrumbItems} />
      <Styled.ProfileTitleWrapper>
        <Styled.ProfileTitle>ورود و امنیت</Styled.ProfileTitle>
      </Styled.ProfileTitleWrapper>
      <Styled.ProfileContentWrapper>
        <ChangePasswordContent />
        <TwoFactorAuthContent />
      </Styled.ProfileContentWrapper>
    </Styled.ProfileViewContainer>
  );
};

export default ProfileSecurity;
