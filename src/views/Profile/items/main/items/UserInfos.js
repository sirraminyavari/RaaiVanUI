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

const UserInfos = () => {
  const { RVGlobal } = useWindow();
  const { FirstName, LastName, JobTitle } = RVGlobal?.CurrentUser;

  const fullName = `${decodeBase64(FirstName)} ${decodeBase64(LastName)}`;

  return (
    <Styled.ProfileInfoWrapper>
      <Styled.UsenameWrapper>{fullName}</Styled.UsenameWrapper>
      <ProfileInfoItem text="درباره..." icon={InfoIcon} />
      <Styled.SectionTitle>راه های ارتباطی</Styled.SectionTitle>
      <ProfileInfoItem text="09123456789" icon={MobileIcon} />
      <ProfileInfoItem text="cliqmind@cliqmind.com" icon={MailIcon} />
      <Styled.SectionTitle>درباره کاربر</Styled.SectionTitle>
      <ProfileInfoItem text="نام سازمان" icon={Buldingicon} />
      <ProfileInfoItem text="نام دپارتمان" icon={SiteMapIcon} />
      <ProfileInfoItem text={decodeBase64(JobTitle)} icon={BriefcaseIcon} />
      <ProfileInfoItem text="نام شهر" icon={AdressMapIcon} />
    </Styled.ProfileInfoWrapper>
  );
};

export default UserInfos;
