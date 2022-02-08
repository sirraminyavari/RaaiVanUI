import { useState } from 'react';
import Button from 'components/Buttons/Button';
import * as Styled from './WorkspacesHeader.styles';
import CreateWorkspaceModal from './CreateWorkspaceModal';
import useWindow from 'hooks/useWindowContext';
import AddIcon from 'components/Icons/AddIcon/AddIcon';
import APIHandler from 'apiHelper/APIHandler';
import { useHistory } from 'react-router-dom';
import { encodeBase64 } from 'helpers/helpers';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import { WORKSPACES_PATH } from '../../../others/constants';

const WorkspaceHeader = () => {
  const [isModalShown, setIsModalShown] = useState(false);
  const [spaceName, setSpaceName] = useState('');
  const history = useHistory();

  const { RVDic } = useWindow();
  const RVDicNewWorkspace = RVDic.CreateN.replace(
    '[n]',
    RVDic.NewN.replace('[n]', RVDic.Workspace)
  );

  const ModalWidth = DimensionHelper().isTabletOrMobile ? '66%' : '33%';

  //! Add new space.
  const handleAddSpace = () => {
    setIsModalShown(true);
  };

  //! Cancel new space creation.
  const handleCancelCreate = () => {
    setIsModalShown(false);
    setSpaceName('');
  };

  const handleInputChange = (inputValue) => {
    setSpaceName(inputValue);
  };

  //! Create new space
  const handleSpaceCreate = () => {
    const apiHandler = new APIHandler('RVAPI', 'CreateWorkspace');
    if (spaceName.length > 0)
      apiHandler.fetch({ Name: encodeBase64(spaceName) }, (response) => {
        history.push(WORKSPACES_PATH);
        console.log(response);

        setIsModalShown(false);
      });
  };

  return (
    <Styled.HeaderContainer>
      <CreateWorkspaceModal
        isOpen={isModalShown}
        onInputChange={handleInputChange}
        inputValue={spaceName}
        onCancelCreate={handleCancelCreate}
        onCreate={handleSpaceCreate}
        modalTitle={RVDicNewWorkspace}
        modalWidth={ModalWidth}
        placeholder={RVDic.WorkspaceName}
      />
      <Styled.HeaderTitle>{RVDic.YourWorkspaces}</Styled.HeaderTitle>
      <Button style={{ minWidth: '10rem' }} onClick={handleAddSpace}>
        <AddIcon size={'1.5rem'} style={{ marginInlineEnd: '.25rem' }} />
        {RVDicNewWorkspace}
      </Button>
    </Styled.HeaderContainer>
  );
};

export default WorkspaceHeader;
