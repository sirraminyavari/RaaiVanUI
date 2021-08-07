import { useState, useEffect } from 'react';
import * as Styled from 'views/Profile/Profile.styles';
import ProfileInfoItem from './ProfileInfoItem';
import InfoIcon from 'components/Icons/InfoCircleIcon/InfoIcon';
import MobileIcon from 'components/Icons/mobileIcon/Mobile';
import MailIcon from 'components/Icons/MailIcon/MailIcon';
import Buldingicon from 'components/Icons/buildingIcon/BuildingIcon';
import SiteMapIcon from 'components/Icons/SiteMapIcon/SiteMapIcon';
import BriefcaseIcon from 'components/Icons/BriefcaseIcon/BriefcaseIcon';
import AdressMapIcon from 'components/Icons/AddressMapIcon/AddressMap';
import useWindow from 'hooks/useWindowContext';
import { decodeBase64 } from 'helpers/helpers';
import { getUser } from 'apiHelper/apiFunctions';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';

const UserInfos = (props) => {
  const [userInfos, setUserInfos] = useState({});
  const [isFetchingInfos, setIsFetchingInfos] = useState(true);
  const { user, isAuthUser } = props;
  const {
    // RVGlobal,
    RVDic,
  } = useWindow();
  const { FirstName, LastName, UserID } = user;

  const fullName = `${decodeBase64(FirstName)} ${decodeBase64(LastName)}`;

  useEffect(() => {
    getUser(UserID)
      .then((res) => {
        // console.log(res);
        setUserInfos(res);
        setIsFetchingInfos(false);
      })
      .catch((err) => {
        console.log(err);
        setIsFetchingInfos(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Styled.ProfileInfoWrapper>
      <Styled.UsenameWrapper>{fullName}</Styled.UsenameWrapper>

      {isFetchingInfos ? (
        <LogoLoader />
      ) : (
        <>
          <ProfileInfoItem
            multiline
            isAuthUser={isAuthUser}
            placeholder="درباره..."
            text=""
            icon={InfoIcon}
          />
          <Styled.SectionTitle>راه های ارتباطی</Styled.SectionTitle>
          <ProfileInfoItem
            isAuthUser={isAuthUser}
            placeholder="شماره موبایل"
            text={decodeBase64(userInfos?.PhoneNumbers?.[0]?.PhoneNumber)}
            icon={MobileIcon}
          />
          <ProfileInfoItem
            isAuthUser={isAuthUser}
            placeholder={RVDic.Email}
            text={decodeBase64(userInfos?.Emails?.[0]?.Email)}
            icon={MailIcon}
          />
          <Styled.SectionTitle>درباره کاربر</Styled.SectionTitle>
          <ProfileInfoItem
            isAuthUser={isAuthUser}
            placeholder="نام سازمان"
            text=""
            icon={Buldingicon}
          />
          <ProfileInfoItem
            isAuthUser={isAuthUser}
            placeholder="نام دپارتمان"
            text=""
            icon={SiteMapIcon}
          />
          <ProfileInfoItem
            isAuthUser={isAuthUser}
            placeholder="عنوان شغلی"
            text={decodeBase64(userInfos?.JobTitle)}
            icon={BriefcaseIcon}
          />
          <ProfileInfoItem
            isAuthUser={isAuthUser}
            placeholder="نام شهر"
            text=""
            icon={AdressMapIcon}
          />
        </>
      )}
    </Styled.ProfileInfoWrapper>
  );
};

export default UserInfos;
