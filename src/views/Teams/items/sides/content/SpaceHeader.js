import { useState } from 'react';
import PropTypes from 'prop-types';
import useWindow from 'hooks/useWindowContext';
import { TC_DEFAULT } from 'constant/Colors';
import * as Styled from 'views/Teams/Teams.styles';
import SettingIcon from 'components/Icons/SettingIcon/Setting';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import SpaceIcon from 'components/Icons/SpaceIcon/SpaceIcon';
import DeleteConfirmModal from 'components/Modal/DeleteConfirm';

/**
 *
 * SpaceHeader component
 *
 * @param {object} props - SpaceHeder component props
 * @param {object} props.space - workspace object
 *
 * @return {JSX.Element} The header associated with each workspace
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

  //TODO Change [RVDic.User] with appropriate localization value
  const userAuthority = space.role === 'admin' ? RVDic.Admin : RVDic.User;

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
        cancelText={RVDicReturn}
        messageTitle={space.title}
        messageIcon={SpaceIcon}
        messageQuestion={RVDicDeleteConfirmQuestion}
        messageWarning={RVDicDeleteConfirmWarning}
      />
      <Styled.SpaceHeaderTitle>
        <SpaceIcon
          className={TC_DEFAULT}
          size={'1.4rem'}
          style={{ marginInlineEnd: '0.6rem' }}
        />
        {/*//? Should <Styled.SpaceHeaderTitle/> component be replaced with <Heading/>?  */}
        {`${space.title} (${userAuthority})`}
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

SpaceHeader.propTypes = {
  space: PropTypes.object.isRequired,
};

export default SpaceHeader;
