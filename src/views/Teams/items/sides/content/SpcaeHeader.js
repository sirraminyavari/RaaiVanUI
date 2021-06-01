import { useState } from 'react';
import * as Styled from '../../../Teams.styles';
import SettingIcon from 'components/Icons/SettingIcon/Setting';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import SpaceIcon from 'components/Icons/SpaceIcon/SpaceIcon';
import DeleteConfirm from 'components/Modal/Confirm';
import DeleteConfirmMSG from './DeleteConfirmMSG';
import useHover from 'hooks/useHover';

const SpcaeHeader = ({ space }) => {
  const [isConfirmShown, setIsConfirmShown] = useState(false);
  const [settingRef, isSettingHovered] = useHover();
  const [trashRef, isTrashHovered] = useHover();

  const onTrashClick = () => {
    setIsConfirmShown(true);
  };

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
        cancelText="بازگشت">
        <DeleteConfirmMSG
          title={space.title}
          icon={SpaceIcon}
          question="آیا از حذف فضای کاری اطمینان دارید؟"
          warning="با حذف فضای کاری، دسترسی به اطلاعات آن برای هیچ کاربری ممکن نخواهد بود و
          فضای کاری به صورت دائمی حذف خواهد شد!"
        />
      </DeleteConfirm>
      <Styled.SpaceHeaderTitle>
        <SpaceIcon color="#2B7BE4" />
        <span style={{ margin: '1rem' }}>{space.title}</span>
      </Styled.SpaceHeaderTitle>
      {space.role === 'admin' && (
        <Styled.SpaceHeaderActions>
          <Styled.TrashIconWrapper ref={trashRef} isHovered={isTrashHovered}>
            <TrashIcon size={12} onClick={onTrashClick} />
          </Styled.TrashIconWrapper>
          <Styled.SettingIconWrapper
            ref={settingRef}
            isHovered={isSettingHovered}>
            <SettingIcon size={16} onClick={handleSpaceSetting} />
          </Styled.SettingIconWrapper>
        </Styled.SpaceHeaderActions>
      )}
    </Styled.SpaceHeaderContainer>
  );
};

export default SpcaeHeader;
