import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import * as Styled from 'views/Teams/Teams.styles';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import ArchivedModal from './ArchivedModal';
import SortHandle from './SortHandle';
import useWindow from 'hooks/useWindowContext';
import TeamPatternDefault from 'assets/images/intersection-2.svg';
import { getApplications } from 'store/actions/applications/ApplicationsAction';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';

const ArchivedTeams = ({ archives, hasHandle }) => {
  const dispatch = useDispatch();
  const [isModalShown, setIsModalShown] = useState(false);
  const { RV_RevFloat, RV_RTL, RV_Float } = useWindow();
  const isMobile = useMediaQuery({
    query: '(max-width: 970px)',
  });
  const { isTabletOrMobile } = DimensionHelper();
  const isMobileScreen = useMediaQuery({ query: '(max-width: 600px)' });

  const getModalWidth = () => {
    if (isMobileScreen) {
      return '85%';
    } else if (isTabletOrMobile) {
      return '70%';
    } else {
      return '35%';
    }
  };

  //! Show add new team modal.
  const handleShowArchived = () => {
    setIsModalShown(true);
  };

  const handleCloseArchived = () => {
    setIsModalShown(false);
    dispatch(getApplications());
  };

  return (
    <Styled.TeamConatiner
      isArchive
      isMobile={isMobile}
      dir={RV_Float}
      revDir={RV_RevFloat}
      onClick={handleShowArchived}
      style={{ cursor: 'pointer' }}>
      <ArchivedModal
        isOpen={isModalShown}
        modalTitle="تیم های آرشیو شده"
        modalWidth={getModalWidth()}
        contentClass="archived-teams"
        archives={archives}
        onModalClose={handleCloseArchived}
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
