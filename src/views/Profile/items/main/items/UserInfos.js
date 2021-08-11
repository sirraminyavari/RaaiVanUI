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
import {
  setEmailAddress,
  editEmailAddress,
  setPhoneNumber,
  editPhoneNumber,
  setJobTitle,
  setAboutMe,
  setCity,
  setDepartment,
  setOrganization,
} from 'apiHelper/apiFunctions';

const UserInfos = (props) => {
  const { user, isAuthUser } = props;
  const [userInfos, setUserInfos] = useState({});
  const [isFetchingInfos, setIsFetchingInfos] = useState(true);
  const {
    // RVGlobal,
    RVDic,
  } = useWindow();
  const { FirstName, LastName, UserID } = user || {};
  console.log(userInfos);

  const fullName = `${decodeBase64(FirstName)} ${decodeBase64(LastName)}`;
  const lastEmail = userInfos?.Emails?.at(-1);
  const mainEmailId = userInfos?.MainEmailID;
  const isMainEmail = mainEmailId === lastEmail?.EmailID;
  const firstPhoneNumber = userInfos?.PhoneNumbers?.at(0);

  //! Get info for user in question.
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

    //? Due to memory leak error in component.
    //! Clean up.
    return () => {
      setUserInfos({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //! Edit phone number of the user.
  const handleEditMobile = (mobile) => {
    if (!!firstPhoneNumber) {
      const numberId = firstPhoneNumber?.NumberID;
      editPhoneNumber(numberId, mobile)
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
    } else {
      setPhoneNumber(UserID, mobile)
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
    }
  };

  //! Edit email address of the user.
  const handleEditEmail = (email) => {
    // console.log(email);
    if (isMainEmail) {
      setEmailAddress(UserID, email)
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
    } else {
      const emailId = lastEmail?.EmailID;
      editEmailAddress(emailId, email)
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
    }
  };

  //! Edit job title of the user.
  const handleEditJobTilte = (jobTitle) => {
    setJobTitle(UserID, jobTitle)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  };

  //! Edit About me of the user.
  const handleEditAboutMe = (text) => {
    // console.log(text);
    setAboutMe(UserID, text)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  };

  //! Edit user city.
  const handleEditCity = (city) => {
    // console.log(city);
    setCity(UserID, city)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  };

  //! Edit user Department.
  const handleEditDepartment = (department) => {
    // console.log(department);
    setDepartment(UserID, department)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  };

  //! Edit user Organization.
  const handleEditOrganization = (organization) => {
    // console.log(organization);
    setOrganization(UserID, organization)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  };

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
            text={decodeBase64(userInfos?.AboutMe)}
            icon={InfoIcon}
            onEdit={handleEditAboutMe}
          />
          <Styled.SectionTitle>راه های ارتباطی</Styled.SectionTitle>
          <ProfileInfoItem
            isAuthUser={isAuthUser}
            placeholder={RVDic.Mobile}
            text={decodeBase64(firstPhoneNumber?.Number)}
            icon={MobileIcon}
            onEdit={handleEditMobile}
          />
          <ProfileInfoItem
            isAuthUser={isAuthUser}
            placeholder={RVDic.Email}
            text={isMainEmail ? '' : decodeBase64(lastEmail?.Email)}
            icon={MailIcon}
            onEdit={handleEditEmail}
            type="email"
          />
          <Styled.SectionTitle>درباره کاربر</Styled.SectionTitle>
          <ProfileInfoItem
            isAuthUser={isAuthUser}
            placeholder="نام سازمان"
            text={decodeBase64(userInfos?.Organization)}
            icon={Buldingicon}
            onEdit={handleEditOrganization}
          />
          <ProfileInfoItem
            isAuthUser={isAuthUser}
            placeholder="نام دپارتمان"
            text={decodeBase64(userInfos?.Department)}
            icon={SiteMapIcon}
            onEdit={handleEditDepartment}
          />
          <ProfileInfoItem
            isAuthUser={isAuthUser}
            placeholder="عنوان شغلی"
            text={decodeBase64(userInfos?.JobTitle)}
            icon={BriefcaseIcon}
            onEdit={handleEditJobTilte}
          />
          <ProfileInfoItem
            isAuthUser={isAuthUser}
            placeholder="نام شهر"
            text={decodeBase64(userInfos?.City)}
            icon={AdressMapIcon}
            onEdit={handleEditCity}
          />
        </>
      )}
    </Styled.ProfileInfoWrapper>
  );
};

export default UserInfos;
