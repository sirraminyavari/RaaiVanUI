import { useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import useWindow from 'hooks/useWindowContext';
import { TC_DEFAULT } from 'constant/Colors';
import * as Styled from './WorkspacePanel.styles';
import SettingIcon from 'components/Icons/SettingIcon/Setting';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import SpaceIcon from 'components/Icons/SpaceIcon/SpaceIcon';
import DeleteConfirmModal from 'components/Modal/DeleteConfirm';
import { decodeBase64 } from 'helpers/helpers';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import { renameWorkspace } from 'apiHelper/ApiHandlers/RVAPI';
import {
  WORKSPACE_USER_MANAGEMENT_PATH,
  WORKSPACE_REMOVE_PATH,
} from '../../../others/constants';
import Tooltip from 'components/Tooltip/react-tooltip/Tooltip';
import { TCV_DEFAULT } from 'constant/CssVariables';
import { RVColorProp } from '@cliqmind/rv-components';

/**
 *
 * WorkspaceHeader component
 *
 * @param {object} props - SpaceHeder component props
 * @param {object} props.space - workspace object
 *
 * @return {JSX.Element} The header associated with each workspace
 */
const WorkspaceHeader = ({ space }) => {
  const [isConfirmShown, setIsConfirmShown] = useState(false);
  const history = useHistory();

  //TODO: Update RVDic object dictionary
  const { RVDic, RVGlobal } = useWindow();
  const RVDicReturn = RVDic.Return;
  const RVDicDeleteConfirmQuestion =
    RVDic.Confirms.AreYouSureYouWantToDeleteTheN.replace(
      '[n]',
      RVDic.Workspace
    );
  const RVDicDeleteConfirmWarning = RVDic._HelpRemoveWorkspace;
  const RVDicRemoveWorkspace = RVDic.RemoveN.replace('[n]', RVDic.Workspace);
  const RVDicWorkspaceSettings = RVDic.SettingsOfN.replace(
    '[n]',
    RVDic.Workspace
  );
  const RVDicEditWorkspaceName = RVDic.EditN.replace(
    '[n]',
    RVDic.WorkspaceName
  );
  const RVDicPermanentlyRemove = RVDic.RemovePermanently;
  // const userAuthority = space.Editable ? RVDic.Admin : RVDic.OrdinaryUser;

  //! Show space delete confirmation.
  const onTrashClick = () => {
    setIsConfirmShown(true);
  };

  //! API call for renaming workspace
  const onWorkspaceRename = async (event) => {
    const Name = event.target.value;
    const { Succeed, ErrorText } = await renameWorkspace({
      WorkspaceID: space.WorkspaceID,
      Name,
    });
    if (Succeed && RVGlobal.IsDev)
      console.log({
        operation: 'rename workspace title',
        type: ErrorText ? 'error' : 'success',
        message: RVDic.MSG[Succeed] || Succeed,
      });
    else if (ErrorText) alert(RVDic.MSG[ErrorText] || ErrorText);
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
      <Styled.SpaceHeaderTitle className={RVColorProp.cgBlue}>
        <SpaceIcon
          size={'1.4rem'}
          style={{ marginInlineEnd: '0.6rem', color: TCV_DEFAULT }}
        />
        {space.Editable ? (
          <Tooltip
            tipId={'RenameWorkspaceTitle'}
            effect="solid"
            place="top"
            renderContent={() => RVDicEditWorkspaceName}
          >
            <Styled.SpaceHeaderTitleInput
              defaultValue={decodeBase64(space.Name)}
              onBlur={onWorkspaceRename}
            />
          </Tooltip>
        ) : (
          <span>{`${decodeBase64(space.Name)}`}</span>
        )}
      </Styled.SpaceHeaderTitle>
      {space.Removable && (
        <Styled.SpaceHeaderActions>
          <Tooltip
            tipId={'RemoveWorkspaceIcon'}
            effect="solid"
            place="top"
            renderContent={() => RVDicRemoveWorkspace}
          >
            <Styled.TrashIconWrapper onClick={onTrashClick}>
              <TrashIcon size={'0.8rem'} />
            </Styled.TrashIconWrapper>
          </Tooltip>
          <Tooltip
            tipId={'workspaceSettingIcon'}
            effect="solid"
            place="top"
            renderContent={() => RVDicWorkspaceSettings}
          >
            <Styled.SettingIconWrapper onClick={handleSpaceSetting}>
              <SettingIcon size={'1rem'} />
            </Styled.SettingIconWrapper>
          </Tooltip>
        </Styled.SpaceHeaderActions>
      )}
    </Styled.SpaceHeaderContainer>
  );
};

WorkspaceHeader.propTypes = {
  space: PropTypes.object.isRequired,
};

export default WorkspaceHeader;
