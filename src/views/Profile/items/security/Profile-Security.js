import * as Styled from 'views/Profile/Profile.styles';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import ChangePasswordContent from './ChangePassword';
import TwoFactorAuthContent from './TwoFactorAuth';
import { USER_SECURITY_PATH, USER_WITHID_PATH } from 'constant/constants';

const ProfileSecurity = ({ route }) => {
  const { User } = route || {};
  const breadcrumbItems = [
    { id: 1, title: 'حساب کاربری', linkTo: USER_WITHID_PATH },
    { id: 2, title: 'ورود  و امنیت', linkTo: USER_SECURITY_PATH },
  ];
  return (
    <Styled.ProfileViewContainer>
      <Breadcrumb items={breadcrumbItems} />
      <Styled.ProfileTitleWrapper>
        <Styled.ProfileTitle>ورود و امنیت</Styled.ProfileTitle>
      </Styled.ProfileTitleWrapper>
      <Styled.ProfileContentWrapper>
        <ChangePasswordContent user={User} />
        <TwoFactorAuthContent user={User} />
      </Styled.ProfileContentWrapper>
    </Styled.ProfileViewContainer>
  );
};

export default ProfileSecurity;
