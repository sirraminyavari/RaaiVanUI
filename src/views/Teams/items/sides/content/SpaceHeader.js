import { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import useWindow from 'hooks/useWindowContext';
import { TC_DEFAULT } from 'constant/Colors';
import * as Styled from 'views/Teams/Teams.styles';
import SettingIcon from 'components/Icons/SettingIcon/Setting';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import SpaceIcon from 'components/Icons/SpaceIcon/SpaceIcon';
import DeleteConfirmModal from 'components/Modal/DeleteConfirm';
import { decodeBase64 } from 'helpers/helpers';
import {
  WORKSPACE_USER_MANAGEMENT_PATH,
  WORKSPACE_REMOVE_PATH,
} from '../../others/constants';

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
  const history = useHistory();

  //TODO: Update RVDic object dictionary
  const { RVDic } = useWindow();
  const RVDicReturn = RVDic.Return;
  const RVDicDeleteConfirmQuestion = RVDic.Confirms.AreYouSureYouWantToDeleteTheN.replace(
    '[n]',
    RVDic.Workspace
  );
  const RVDicDeleteConfirmWarning = RVDic._HelpRemoveWorkspace;
  const RVDicRemoveWorkspace = RVDic.RemoveN.replace('[n]', RVDic.Workspace);
  const RVDicPermanentlyRemove = RVDic.RemovePermanently;
  const userAuthority = space.Editable ? RVDic.Admin : RVDic.OrdinaryUser;

  //! Show space delete confirmation.
  const onTrashClick = () => {
    setIsConfirmShown(true);
  };

  //! Cancel space deletion.
  const handleCancelDelete = () => {
    setIsConfirmShown(false);
  };

  const handleSpaceDelete = () => {
    history.push(`${WORKSPACE_REMOVE_PATH}/${space.WorkspaceID}`);
  };

  const handleSpaceSetting = () => {
    history.push(`${WORKSPACE_USER_MANAGEMENT_PATH}/${space.WorkspaceID}`);
  };

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
        messageTitle={decodeBase64(space.Name)}
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
        {`${decodeBase64(space.Name)} (${userAuthority})`}
      </Styled.SpaceHeaderTitle>
      {space.Removable && (
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
