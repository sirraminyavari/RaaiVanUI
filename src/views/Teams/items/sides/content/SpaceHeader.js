import { useState } from 'react';
import PropTypes from 'prop-types';
import * as Styled from 'views/Teams/Teams.styles';
import SettingIcon from 'components/Icons/SettingIcon/Setting';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import SpaceIcon from 'components/Icons/SpaceIcon/SpaceIcon';
import DeleteConfirmModal from 'components/Modal/Confirm';
import DeleteConfirmMessage from 'components/Modal/Messages/DeleteConfirm';
import useWindow from 'hooks/useWindowContext';
import { TC_DEFAULT } from 'constant/Colors';

/**
 *
 * SpaceHeader component
 *
 * @param {object} props - SpaceHeder component props
 * @param {object} [props.space] - workspace object
 *
 * @return {JSX.Element} The fragment created.
 */
const SpaceHeader = ({ space }) => {
  const [isConfirmShown, setIsConfirmShown] = useState(false);

  //TODO: Update RVDic object dictionary
  const { RVDic } = useWindow();
  const RVDicReturn = RVDic.Return;
  const RVDicDeleteConfirmQuestion = 'آیا از حذف فضای کاری اطمینان دارید؟';
  const RVDicDeleteConfirmWarning =
    'با حذف فضای کاری، دسترسی به اطلاعات آن برای هیچ کاربری ممکن نخواهد بود و فضای کاری به صورت دائمی حذف خواهد شد!';
  const RVDicRemoveWorkspace = RVDic.RemoveN.replace('[n]', RVDic.Workspace);
  const RVDicPermanentlyRemove = RVDic.RemoveN.replace('[n]', 'دائمی');

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
      <DeleteConfirmModal
        title={RVDicRemoveWorkspace}
        show={isConfirmShown}
        onCancel={handleCancelDelete}
        onClose={handleCancelDelete}
        onConfirm={handleSpaceDelete}
        confirmText={RVDicPermanentlyRemove}
        cancelText={RVDicReturn}>
        <DeleteConfirmMessage
          title={space.title}
          Icon={SpaceIcon}
          question={RVDicDeleteConfirmQuestion}
          warning={RVDicDeleteConfirmWarning}
        />
      </DeleteConfirmModal>
      <Styled.SpaceHeaderTitle>
        <SpaceIcon className={TC_DEFAULT} />
        <span style={{ margin: ' 0 1rem' }}>{space.title}</span>
      </Styled.SpaceHeaderTitle>
      {space.role === 'admin' && (
        <Styled.SpaceHeaderActions>
          <Styled.TrashIconWrapper onClick={onTrashClick}>
            <TrashIcon size={'0.8rem'} />
          </Styled.TrashIconWrapper>
          <Styled.SettingIconWrapper onClick={handleSpaceSetting}>
            <SettingIcon size={'1rem'} />
          </Styled.SettingIconWrapper>
        </Styled.SpaceHeaderActions>
      )}
    </Styled.SpaceHeaderContainer>
  );
};

export default SpaceHeader;

SpaceHeader.propTypes = {
  space: PropTypes.object.isRequired,
};
