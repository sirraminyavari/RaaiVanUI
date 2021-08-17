import { useEffect, useState } from 'react';
import * as Styled from 'views/Profile/Profile.styles';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import ChangePasswordContent from './ChangeEmailAndPassword';
import TwoFactorAuthContent from './TwoFactorAuth';
import { USER_PATH, USER_SECURITY_PATH } from 'constant/constants';
import useWindow from 'hooks/useWindowContext';
import { getUser } from 'apiHelper/apiFunctions';

const ProfileSecurity = ({ route }) => {
  const { User } = route || {};
  const { RVDic, GlobalUtilities, RVGlobal } = useWindow();
  const [authUser, setAuthUser] = useState(User);
  const [captchaToken, setCaptchaToken] = useState('');
  const { Security, And, Authentication, Profile } = RVDic || {};

  const isSaas = (RVGlobal || {}).SAASBasedMultiTenancy;

  const PAGE_TITLE = `${Security} ${And} ${Authentication}`;

  const breadcrumbItems = [
    { id: 1, title: Profile, linkTo: USER_PATH },
    {
      id: 2,
      title: PAGE_TITLE,
      linkTo: USER_SECURITY_PATH,
    },
  ];

  //! Set captcha token.
  const handleInitCaptcha = () => {
    GlobalUtilities?.init_recaptcha((captcha) => {
      captcha?.getToken((token) => {
        //use token
        // console.log(token);
        setCaptchaToken(token);
      });
    });
  };

  //! Init captcha.
  useEffect(() => {
    const script = document?.createElement('script');
    //! reCaptcha is just for SAAS
    if (isSaas) {
      script.src = RVGlobal?.CaptchaURL;
      script?.addEventListener('load', handleInitCaptcha);
      document?.body?.appendChild(script);
    }
    return () => {
      //! remove reCapctha on clean up.
      isSaas && document?.body?.removeChild(script);
      isSaas && GlobalUtilities.hide_recaptcha();
    };
  }, []);

  //! Get profile user and its extra infos.
  useEffect(() => {
    getUser(User?.UserID)
      .then((response) => {
        // console.log(response);
        setAuthUser(response);
      })
      .catch((error) => {
        // console.log(error);
        setAuthUser(User);
      });

    //! Clean up.
    return () => {
      setAuthUser({});
    };
  }, [User]);

  return (
    <Styled.ProfileViewContainer>
      <Breadcrumb items={breadcrumbItems} />
      <Styled.ProfileTitleWrapper>
        <Styled.ProfileTitle>{PAGE_TITLE}</Styled.ProfileTitle>
      </Styled.ProfileTitleWrapper>
      <Styled.ProfileContentWrapper>
        <ChangePasswordContent user={authUser} captchaToken={captchaToken} />
        <TwoFactorAuthContent user={authUser} />
      </Styled.ProfileContentWrapper>
    </Styled.ProfileViewContainer>
  );
};

export default ProfileSecurity;
