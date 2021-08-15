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
  setFirstName,
  setLastName,
} from 'apiHelper/apiFunctions';

const UserInfos = (props) => {
  const { user, isAuthUser } = props;
  const [userInfos, setUserInfos] = useState({});
  const [isFetchingInfos, setIsFetchingInfos] = useState(true);
  const { RVGlobal, RVDic } = useWindow();
  const { FirstName, LastName, UserID } = user || {};
  // console.log(userInfos);

  const isSaas = (RVGlobal || {}).SAASBasedMultiTenancy;
  const isAdmin = (RVGlobal || {}).IsSystemAdmin;
  const isAdminAndNotSaas = isAdmin && !isSaas;

  const fullName = `${decodeBase64(FirstName)} ${decodeBase64(LastName)}`;
  const emailList = userInfos?.Emails || [];
  const [lastEmail] = emailList.slice(-1);
  const mainEmailId = userInfos?.MainEmailID;
  const isMainEmail = mainEmailId === lastEmail?.EmailID;
  const [firstPhoneNumber] = userInfos?.PhoneNumbers || [];

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
  const handleEditMobile = (newMobile) => {
    const prevMobileNumber = decodeBase64(firstPhoneNumber?.Number);
    if (!!firstPhoneNumber) {
      if (prevMobileNumber === newMobile.trim()) return;
      const numberId = firstPhoneNumber?.NumberID;
      // console.log(numberId, mobile);
      editPhoneNumber(numberId, newMobile)
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
    } else {
      setPhoneNumber(UserID, newMobile)
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
    }
  };

  //! Edit email address of the user.
  const handleEditEmail = (newEmail) => {
    const prevEmail = decodeBase64(lastEmail?.Email);
    if (prevEmail === newEmail.trim()) return;
    // console.log(email);
    if (isMainEmail) {
      setEmailAddress(UserID, newEmail)
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
    } else {
      const emailId = lastEmail?.EmailID;
      editEmailAddress(emailId, newEmail)
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
    }
  };

  //! Edit job title of the user.
  const handleEditJobTilte = (newJobTitle) => {
    const prevJobTitle = decodeBase64(userInfos?.JobTitle);
    if (prevJobTitle === newJobTitle.trim()) return;

    setJobTitle(UserID, newJobTitle)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  };

  //! Edit about me of the user.
  const handleEditAboutMe = (newAboutMe) => {
    const prevAboutMe = decodeBase64(userInfos?.AboutMe);
    if (prevAboutMe === newAboutMe.trim()) return;

    setAboutMe(UserID, newAboutMe)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  };

  //! Edit user city.
  const handleEditCity = (newCity) => {
    if (!isSaas) return;
    const prevCity = decodeBase64(userInfos?.City);
    if (prevCity === newCity.trim()) return;

    setCity(UserID, newCity)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  };

  //! Edit user Department.
  const handleEditDepartment = (newDepartment) => {
    if (!isSaas) return;
    const prevDepartment = decodeBase64(userInfos?.Department);
    if (prevDepartment === newDepartment.trim()) return;

    setDepartment(UserID, newDepartment)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  };

  //! Edit user Organization.
  const handleEditOrganization = (newOrganization) => {
    if (!isSaas) return;
    const prevOrganization = decodeBase64(userInfos?.Organization);
    if (prevOrganization === newOrganization.trim()) return;

    setOrganization(UserID, newOrganization)
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  };

  //! Edit user first name.
  const handleEditFirstName = (newFirstName) => {
    const prevFirstName = decodeBase64(FirstName);
    if (prevFirstName === newFirstName.trim()) return;

    setFirstName(UserID, newFirstName)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //! Edit user last name.
  const handleEditLastName = (newLastName) => {
    const prevLastName = decodeBase64(LastName);
    if (prevLastName === newLastName.trim()) return;

    setLastName(UserID, newLastName)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Styled.ProfileInfoWrapper>
      {isAuthUser || isAdminAndNotSaas ? (
        <div style={{ marginBottom: '2rem' }}>
          <ProfileInfoItem
            isAuthUser={isAuthUser}
            placeholder={RVDic?.FirstName}
            text={decodeBase64(FirstName)}
            onEdit={handleEditFirstName}
            inlineTextClass="inline-text-profile-info-name"
          />
          <ProfileInfoItem
            isAuthUser={isAuthUser}
            placeholder={RVDic?.LastName}
            text={decodeBase64(LastName)}
            onEdit={handleEditLastName}
            inlineTextClass="inline-text-profile-info-name"
          />
        </div>
      ) : (
        <Styled.UsenameWrapper>{fullName}</Styled.UsenameWrapper>
      )}

      {isFetchingInfos ? (
        <LogoLoader />
      ) : (
        <>
          <ProfileInfoItem
            multiline
            isAuthUser={isAuthUser}
            placeholder={RVDic.AboutMe}
            text={decodeBase64(userInfos?.AboutMe)}
            icon={InfoIcon}
            onEdit={handleEditAboutMe}
          />
          <Styled.SectionTitle>{RVDic.ContactInfo}</Styled.SectionTitle>
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
          {isSaas && (
            <ProfileInfoItem
              isAuthUser={isAuthUser}
              placeholder={RVDic.Organization}
              text={decodeBase64(userInfos?.Organization)}
              icon={Buldingicon}
              onEdit={handleEditOrganization}
            />
          )}
          {isSaas && (
            <ProfileInfoItem
              isAuthUser={isAuthUser}
              placeholder={RVDic.Department}
              text={decodeBase64(userInfos?.Department)}
              icon={SiteMapIcon}
              onEdit={handleEditDepartment}
            />
          )}
          <ProfileInfoItem
            isAuthUser={isAuthUser}
            placeholder={RVDic.JobTitle}
            text={decodeBase64(userInfos?.JobTitle)}
            icon={BriefcaseIcon}
            onEdit={handleEditJobTilte}
          />
          {isSaas && (
            <ProfileInfoItem
              isAuthUser={isAuthUser}
              placeholder={RVDic.City}
              text={decodeBase64(userInfos?.City)}
              icon={AdressMapIcon}
              onEdit={handleEditCity}
            />
          )}
        </>
      )}
    </Styled.ProfileInfoWrapper>
  );
};

export default UserInfos;
