import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import * as Styled from 'views/Teams/Teams.styles';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import ArchivedModal from './ArchivedModal';
import SortHandle from './SortHandle';
import useWindow from 'hooks/useWindowContext';
import TeamPatternDefault from 'assets/images/team-card-pattern.svg';

const ArchivedTeams = ({ team, hasHandle }) => {
  const [isModalShown, setIsModalShown] = useState(false);
  const { RV_RevFloat, RV_RTL } = useWindow();
  const isMobileScreen = useMediaQuery({
    query: '(max-width: 970px)',
  });

  //! Show add new team modal.
  const handleShowArchived = () => {
    setIsModalShown(true);
  };

  const handleArchiveClose = () => {
    setIsModalShown(false);
  };

  return (
    <Styled.TeamConatiner
      isMobile={isMobileScreen}
      onClick={handleShowArchived}
      style={{ cursor: 'pointer' }}>
      <ArchivedModal
        isOpen={isModalShown}
        modalTitle="تیم های آرشیو شده"
        modalWidth="35%"
        archives={team.archives}
        onArchiveClose={handleArchiveClose}
      />
      {hasHandle && <SortHandle />}
      <Styled.TeamPattern
        dir={RV_RevFloat}
        rtl={RV_RTL}
        src={TeamPatternDefault}
        alt="team-pattern"
      />
      <Styled.ArchivedWrapper>
        <TrashIcon size={25} />
        <Styled.ArchivedTeamsLabel>
          <span>تیم های آرشیو شده</span>
        </Styled.ArchivedTeamsLabel>
      </Styled.ArchivedWrapper>
    </Styled.TeamConatiner>
  );
};

export default ArchivedTeams;
