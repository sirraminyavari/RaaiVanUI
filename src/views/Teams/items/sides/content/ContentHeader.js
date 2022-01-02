import { useState } from 'react';
import Button from 'components/Buttons/Button';
import * as Styled from 'views/Teams/Teams.styles';
import CreateModal from './CreateModal';
import useWindow from 'hooks/useWindowContext';
import { useMediaQuery } from 'react-responsive';
import { MOBILE_BOUNDRY } from 'constant/constants';
import AddIcon from 'components/Icons/AddIcon/AddIcon';

const Header = () => {
  const [isModalShown, setIsModalShown] = useState(false);
  const [spaceName, setSpaceName] = useState('');

  const { RVDic } = useWindow();
  const RVDicNewWorkspace = RVDic.CreateN.replace(
    '[n]',
    RVDic.NewN.replace('[n]', RVDic.Workspace)
  );

  //? How to handle modal responsiveness?
  const ModalWidth = useMediaQuery({
    query: `(max-width: ${MOBILE_BOUNDRY})`,
  })
    ? '66%'
    : '33%';

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

  //TODO: Create new space
  const handleSpaceCreate = () => {};

  return (
    <Styled.HeaderContainer>
      <CreateModal
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
        <AddIcon style={{ fontSize: '1.5em', marginInlineEnd: 2 }} />
        {RVDicNewWorkspace}
      </Button>
    </Styled.HeaderContainer>
  );
};

export default Header;
