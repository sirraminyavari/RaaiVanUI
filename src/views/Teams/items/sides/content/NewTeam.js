import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import * as Styled from '../../../Teams.styles';
import PlusIcon from 'components/Icons/PlusIcon/PlusIcon';
import CreateModal from './CreateModal';
import { createApplication } from 'store/actions/applications/ApplicationsAction';

const NewTeam = () => {
  const [isModalShown, setIsModalShown] = useState(false);
  const [teamName, setTeamName] = useState(null);
  const dispatch = useDispatch();
  const isMobileScreen = useMediaQuery({
    query: '(max-width: 970px)',
  });

  //! Show add new team modal.
  const handleAddTeam = () => {
    setIsModalShown(true);
  };

  //! Close modal and cancel add team proccess.
  const handleCancelCreate = () => {
    setIsModalShown(false);
    setTeamName(null);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setTeamName(inputValue);
  };

  //! Add team and call api.
  const handleTeamCreate = () => {
    if (!!teamName) {
      dispatch(createApplication(teamName, console.log));
      setIsModalShown(false);
    }
  };

  return (
    <Styled.TeamConatiner
      isNew
      isMobile={isMobileScreen}
      onClick={handleAddTeam}
      style={{ cursor: 'pointer' }}>
      <CreateModal
        isOpen={isModalShown}
        onInputChange={handleInputChange}
        onCancleCreate={handleCancelCreate}
        onCreate={handleTeamCreate}
        modalTitle="ایجاد تیم جدید"
        modalWidth="40%"
      />
      <Styled.NewTeamWrapper>
        <PlusIcon size={40} />
        <Styled.NewTeamLabel>
          <span>ایجاد تیم جدید</span>
        </Styled.NewTeamLabel>
      </Styled.NewTeamWrapper>
    </Styled.TeamConatiner>
  );
};

export default NewTeam;
