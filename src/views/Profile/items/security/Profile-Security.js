import * as Styled from 'views/Profile/Profile.styles';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import ChangePasswordContent from './ChangePassword';
import TwoFactorAuthContent from './TwoFactorAuth';
import { USER_PATH, USER_SECURITY_PATH } from 'constant/constants';
import useWindow from 'hooks/useWindowContext';

const ProfileSecurity = ({ route }) => {
  const { User } = route || {};
  const { RVDic } = useWindow();

  const PAGE_TITLE =
    RVDic.Security + ' ' + RVDic.And + ' ' + RVDic.Authentication;

  const breadcrumbItems = [
    { id: 1, title: RVDic.Profile, linkTo: USER_PATH },
    {
      id: 2,
      title: PAGE_TITLE,
      linkTo: USER_SECURITY_PATH,
    },
  ];
  return (
    <Styled.ProfileViewContainer>
      <Breadcrumb items={breadcrumbItems} />
      <Styled.ProfileTitleWrapper>
        <Styled.ProfileTitle>{PAGE_TITLE}</Styled.ProfileTitle>
      </Styled.ProfileTitleWrapper>
      <Styled.ProfileContentWrapper>
        <ChangePasswordContent user={User} />
        <TwoFactorAuthContent user={User} />
      </Styled.ProfileContentWrapper>
    </Styled.ProfileViewContainer>
  );
};

export default ProfileSecurity;
