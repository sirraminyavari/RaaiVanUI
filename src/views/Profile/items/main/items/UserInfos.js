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

const ABOUT_ME_TEXT =
  'فیلد درباره من، اگه ممکنه به صورت چند خطی دربیاد در تعداد کاراکتر بالا. هم موقع ادیت و هم موقع نمایش که با اسم تداخل نداشته باشه';

const UserInfos = () => {
  const { RVGlobal, RVDic } = useWindow();
  const { FirstName, LastName, JobTitle } = RVGlobal?.CurrentUser;

  const fullName = `${decodeBase64(FirstName)} ${decodeBase64(LastName)}`;

  return (
    <Styled.ProfileInfoWrapper>
      <Styled.UsenameWrapper>{fullName}</Styled.UsenameWrapper>
      <ProfileInfoItem
        multiline
        placeholder="درباره..."
        text={ABOUT_ME_TEXT}
        icon={InfoIcon}
      />
      <Styled.SectionTitle>راه های ارتباطی</Styled.SectionTitle>
      <ProfileInfoItem placeholder="شماره موبایل" text="" icon={MobileIcon} />
      <ProfileInfoItem placeholder={RVDic.Email} text="" icon={MailIcon} />
      <Styled.SectionTitle>درباره کاربر</Styled.SectionTitle>
      <ProfileInfoItem placeholder="نام سازمان" text="" icon={Buldingicon} />
      <ProfileInfoItem placeholder="نام دپارتمان" text="" icon={SiteMapIcon} />
      <ProfileInfoItem
        placeholder="عنوان شغلی"
        text={decodeBase64(JobTitle)}
        icon={BriefcaseIcon}
      />
      <ProfileInfoItem placeholder="نام شهر" text="" icon={AdressMapIcon} />
    </Styled.ProfileInfoWrapper>
  );
};

export default UserInfos;
