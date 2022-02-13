import { useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Styled from './WorkspaceArchivedTeams.styles';
import * as GlobalStyled from 'views/Teams/Teams.styles';
import TrashIcon from 'components/Icons/TrashIcon/Trash';
import ArchivedModal from './WorkspaceArchivedModal';
import SortHandle from '../SortHandle';
import useWindow from 'hooks/useWindowContext';
import TeamPatternDefault from 'assets/images/intersection-2.svg';
import { getApplications } from 'store/actions/applications/ApplicationsAction';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';

const WorkspaceArchivedTeams = ({ archives, hasHandle, space }) => {
  const dispatch = useDispatch();
  const [isModalShown, setIsModalShown] = useState(false);
  const { RV_RevFloat, RV_RTL, RVDic } = useWindow();
  // const isMobile = useMediaQuery({
  //   query: '(max-width: 970px)',
  // });
  const { isTabletOrMobile, isMobile } = DimensionHelper();

  const getModalWidth = () => {
    if (isMobile) {
      return '85%';
    } else if (isTabletOrMobile) {
      return '60%';
    } else {
      return '40%';
    }
  };

  //! Show add new team modal.
  const handleShowArchived = () => {
    setIsModalShown(true);
  };

  const handleCloseArchivedModal = (hasRecycledApps) => {
    setIsModalShown(false);
    if (hasRecycledApps) {
      dispatch(getApplications());
    }
  };

  return (
    <GlobalStyled.TeamContainer
      isArchive
      isMobile={isTabletOrMobile}
      onClick={handleShowArchived}
      style={{ cursor: 'pointer' }}>
      <ArchivedModal
        space={space}
        isOpen={isModalShown}
        modalTitle={RVDic.ArchivedTeams}
        modalWidth={getModalWidth()}
        contentClass="archived-teams"
        archives={archives}
        onModalClose={handleCloseArchivedModal}
      />
      {hasHandle && <SortHandle />}
      <GlobalStyled.TeamPattern
        dir={RV_RevFloat}
        rtl={RV_RTL}
        src={TeamPatternDefault}
        alt="team-pattern"
      />
      <Styled.ArchivedWrapper>
        <TrashIcon size={25} />
        <Styled.ArchivedTeamsLabel>
          <span>{RVDic.ArchivedTeams}</span>
        </Styled.ArchivedTeamsLabel>
      </Styled.ArchivedWrapper>
    </GlobalStyled.TeamContainer>
  );
};

export default WorkspaceArchivedTeams;