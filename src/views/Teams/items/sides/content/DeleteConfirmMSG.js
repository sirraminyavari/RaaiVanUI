import * as Styled from '../../../Teams.styles';
import SpaceIcon from 'components/Icons/SpaceIcon/SpaceIcon';

const DeleteConfirmMSG = ({ title }) => {
  return (
    <div style={{ margin: '0 2.5rem' }}>
      <Styled.ConfirmSpaceTitle>
        <SpaceIcon size={25} color="#2B7BE4" />
        <span style={{ margin: '0.5rem' }}>{title}</span>
      </Styled.ConfirmSpaceTitle>
      <Styled.ConfirmQuestion>
        آیا از حذف فضای کاری اطمینان دارید؟
      </Styled.ConfirmQuestion>
      <Styled.ConfirmWarning>
        با حذف فضای کاری، دسترسی به اطلاعات آن برای هیچ کاربری ممکن نخواهد بود و
        فضای کاری به صورت دائمی حذف خواهد شد!
      </Styled.ConfirmWarning>
    </div>
  );
};

export default DeleteConfirmMSG;
