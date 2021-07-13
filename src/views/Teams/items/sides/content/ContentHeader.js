import { useState } from 'react';
import Button from 'components/Buttons/Button';
import * as Styled from 'views/Teams/Teams.styles';
import CreateModal from './CreateModal';
import useWindow from 'hooks/useWindowContext';

const Header = () => {
  const [isModalShown, setIsModalShown] = useState(false);
  const [spaceName, setSpaceName] = useState('');
  const { RVDic } = useWindow();

  const RVDicNewWorkspace = RVDic.CreateN.replace(
    '[n]',
    RVDic.NewN.replace('[n]', RVDic.Workspace)
  );

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

  //! Create new space .
  const handleSpaceCreate = () => {};

  return (
    <Styled.HeaderContainer>
      <CreateModal
        isOpen={isModalShown}
        onInputChange={handleInputChange}
        inputValue={spaceName}
        onCancleCreate={handleCancelCreate}
        onCreate={handleSpaceCreate}
        modalTitle={RVDicNewWorkspace}
        modalWidth="35%"
        placeholder={RVDic.WorkspaceName}
      />
      <Styled.HeaderTitle>{RVDic.YourWorkspaces}</Styled.HeaderTitle>
      <Button style={{ width: '10rem' }} onClick={handleAddSpace}>
        {`+ ${RVDicNewWorkspace} `}
      </Button>
    </Styled.HeaderContainer>
  );
};

export default Header;
