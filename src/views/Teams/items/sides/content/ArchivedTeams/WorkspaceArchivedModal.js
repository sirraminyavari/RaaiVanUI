import { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Styled from './WorkspaceArchivedTeams.styles';
import Modal from 'components/Modal/Modal';
import { TC_DEFAULT, BO_FREEZED } from 'constant/Colors';
import { decodeBase64 } from 'helpers/helpers';
import Button from 'components/Buttons/Button';
import Avatar from 'components/Avatar/Avatar';
import useWindow from 'hooks/useWindowContext';
import ScrollBarProvider from 'components/ScrollBarProvider/ScrollBarProvider';
import TeamConfirm from '../TeamConfirm';
import { useApplicationSlice } from 'store/slice/applications';

const WorkspaceArchivedModal = (props) => {
  const dispatch = useDispatch();
  const { RVDic, GlobalUtilities } = useWindow();
  const [recycledIds, setRecycledIds] = useState([]);
  const [recyclingIds, setRecyclingIds] = useState([]);

  const { actions: applicationActions } = useApplicationSlice();

  const {
    isOpen,
    onModalClose,
    modalTitle,
    modalWidth,
    archives,
    contentClass,
    space,
  } = props;

  const [confirm, setConfirm] = useState({
    team: null,
    message: '',
    title: '',
    isOpen: false,
  });

  const resetConfirm = () =>
    setConfirm({ team: null, message: '', title: '', isOpen: false });

  const onRecycleDone = (response) => {
    setRecycledIds((oldIds) => [...oldIds, response?.AppID]);
    setRecyclingIds((oldIds) => oldIds.filter((id) => id !== response?.AppID));
  };

  const recycleTeam = (teamId) => {
    dispatch(
      applicationActions.recoverApplication({
        ApplicationID: teamId,
        done: onRecycleDone,
      })
    );
    setRecyclingIds((oldIds) => [...oldIds, teamId]);
  };

  const handleRecycle = (archivedTeam) => {
    const message = RVDic.Confirms.DoYouWantToRecycleTheN.replace(
      '[n]',
      `"${decodeBase64(archivedTeam?.Title)}"`
    );
    const title = RVDic.RecoverN.replace('[n]', RVDic.Team);
    setConfirm({ team: archivedTeam, message, title, isOpen: true });
  };

  const handleConfirmation = () => {
    recycleTeam(confirm.team?.ApplicationID);
    resetConfirm();
  };

  const handleCancelConfirmation = () => {
    resetConfirm();
  };

  const handleCloseModal = () => {
    onModalClose(!!recycledIds.length);
    setRecycledIds([]);
    setRecyclingIds([]);
  };

  return (
    <Styled.ArchivedTeamsModalContainer modalWidth={modalWidth}>
      <Modal
        titleClass={TC_DEFAULT}
        contentWidth={modalWidth}
        contentClass={contentClass}
        titleContainerClass="archived-teams-title"
        title={modalTitle}
        show={isOpen}
        onClose={handleCloseModal}
      >
        <Styled.ModalContentWrapper>
          <TeamConfirm
            isOpen={confirm.isOpen}
            onConfirm={handleConfirmation}
            onCancel={handleCancelConfirmation}
            message={confirm.message}
            title={confirm.title}
          />
          <ScrollBarProvider>
            {archives?.map((archive, index, self) => {
              if (archive.WorkspaceID === space.WorkspaceID)
                return (
                  <Fragment key={archive?.ApplicationID}>
                    <Styled.ArchivedTeamWrapper>
                      <Styled.ArchivedTeamDescription>
                        <Avatar
                          radius={30}
                          userImage={GlobalUtilities.add_timestamp(
                            archive?.IconURL
                          )}
                          style={{ minWidth: '2.1rem' }}
                        />
                        <Styled.ArchivedTeamTitle>
                          {decodeBase64(archive?.Title)}
                        </Styled.ArchivedTeamTitle>
                      </Styled.ArchivedTeamDescription>
                      <Button
                        loading={recyclingIds.includes(archive.ApplicationID)}
                        onClick={() => handleRecycle(archive)}
                        type="primary-o"
                        style={{
                          height: '1.5rem',
                          minWidth: '5rem',
                          textTransform: 'capitalize',
                        }}
                      >
                        {RVDic?.Activate}
                      </Button>
                    </Styled.ArchivedTeamWrapper>
                    {self.length !== index + 1 && <hr className={BO_FREEZED} />}
                  </Fragment>
                );
              return;
            })}
          </ScrollBarProvider>
        </Styled.ModalContentWrapper>
      </Modal>
    </Styled.ArchivedTeamsModalContainer>
  );
};

export default WorkspaceArchivedModal;
