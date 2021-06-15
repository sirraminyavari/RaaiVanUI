import { useState } from 'react';
import * as Styled from '../../../Teams.styles';
import SettingIcon from 'components/Icons/SettingIcon/Setting';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import SpaceIcon from 'components/Icons/SpaceIcon/SpaceIcon';
import DeleteConfirm from 'components/Modal/Confirm';
import DeleteConfirmMSG from './DeleteConfirmMSG';
import useHover from 'hooks/useHover';
import useWindow from 'hooks/useWindowContext';
import { TC_DEFAULT } from 'constant/Colors';

const SpcaeHeader = ({ space }) => {
  const [isConfirmShown, setIsConfirmShown] = useState(false);
  const [settingRef, isSettingHovered] = useHover();
  const [trashRef, isTrashHovered] = useHover();
  const { RVDic } = useWindow();

  //! Show space delete confirmation.
  const onTrashClick = () => {
    setIsConfirmShown(true);
  };

  //! Cancel space deletion.
  const handleCancelDelete = () => {
    setIsConfirmShown(false);
  };

  const handleSpaceDelete = () => {};

  const handleSpaceSetting = () => {};

  return (
    <Styled.SpaceHeaderContainer>
      <DeleteConfirm
        title="حذف فضای کاری"
        show={isConfirmShown}
        onCancel={handleCancelDelete}
        onClose={handleCancelDelete}
        onConfirm={handleSpaceDelete}
        confirmText="حذف دایمی"
        cancelText={RVDic.Return}>
        <DeleteConfirmMSG
          title={space.title}
          icon={SpaceIcon}
          question="آیا از حذف فضای کاری اطمینان دارید؟"
          warning="با حذف فضای کاری، دسترسی به اطلاعات آن برای هیچ کاربری ممکن نخواهد بود و
          فضای کاری به صورت دائمی حذف خواهد شد!"
        />
      </DeleteConfirm>
      <Styled.SpaceHeaderTitle>
        <SpaceIcon className={TC_DEFAULT} />
        <span style={{ margin: '1rem' }}>{space.title}</span>
      </Styled.SpaceHeaderTitle>
      {space.role === 'admin' && (
        <Styled.SpaceHeaderActions>
          <Styled.TrashIconWrapper
            ref={trashRef}
            isHovered={isTrashHovered}
            onClick={onTrashClick}>
            <TrashIcon size={12} />
          </Styled.TrashIconWrapper>
          <Styled.SettingIconWrapper
            ref={settingRef}
            isHovered={isSettingHovered}
            onClick={handleSpaceSetting}>
            <SettingIcon size={16} />
          </Styled.SettingIconWrapper>
        </Styled.SpaceHeaderActions>
      )}
    </Styled.SpaceHeaderContainer>
  );
};

export default SpcaeHeader;
