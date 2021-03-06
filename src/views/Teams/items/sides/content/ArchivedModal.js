import { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Styled from 'views/Teams/Teams.styles';
import Modal from 'components/Modal/Modal';
import { TC_DEFAULT, BO_FREEZED } from 'constant/Colors';
import { decodeBase64 } from 'helpers/helpers';
import Button from 'components/Buttons/Button';
import Avatar from 'components/Avatar/Avatar';
import useWindow from 'hooks/useWindowContext';
import { recycleApplication } from 'store/actions/applications/ApplicationsAction';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import TeamConfirm from './TeamConfirm';

const ArchivedModal = (props) => {
  const dispatch = useDispatch();
  const { RVDic } = useWindow();

  const {
    isOpen,
    onModalClose,
    modalTitle,
    modalWidth,
    archives,
    contentClass,
  } = props;
  const [confirm, setConfirm] = useState({
    team: null,
    message: '',
    title: '',
    isOpen: false,
  });

  const resetConfirm = () =>
    setConfirm({ team: null, message: '', title: '', isOpen: false });

  const onRecycleDone = (message) => {
    // console.log(message);
  };

  const recycleTeam = (teamId) => {
    dispatch(recycleApplication(teamId, onRecycleDone, true));
  };

  const handleRecycle = (archivedTeam) => {
    const message = RVDic.Confirms.DoYouWantToRecycleTheN.replace(
      '[n]',
      `"${decodeBase64(archivedTeam?.Title)}"`
    );
    const title = 'بازیافت تیم';
    setConfirm({ team: archivedTeam, message, title, isOpen: true });
  };

  const handleConfirmation = () => {
    recycleTeam(confirm.team?.ApplicationID);
    resetConfirm();
  };

  const handleCancelConfirmation = () => {
    resetConfirm();
  };

  return (
    <Modal
      titleClass={TC_DEFAULT}
      contentWidth={modalWidth}
      contentClass={contentClass}
      titleContainerClass="archived-teams-title"
      title={modalTitle}
      show={isOpen}
      onClose={onModalClose}>
      <Styled.ModalContentWrapper>
        <TeamConfirm
          isOpen={confirm.isOpen}
          onConfirm={handleConfirmation}
          onCancel={handleCancelConfirmation}
          message={confirm.message}
          title={confirm.title}
        />
        <PerfectScrollbar
          style={{
            marginLeft: '-1rem',
            marginRight: '-1rem',
            padding: '0 1rem',
          }}>
          {archives?.map((archive, index, self) => {
            return (
              <Fragment key={archive?.ApplicationID}>
                <Styled.ArchivedTeamWrapper>
                  <Styled.ArchivedTeamDescription>
                    <Avatar
                      radius={30}
                      userImage={archive?.IconURL}
                      style={{ minWidth: '2.1rem' }}
                    />
                    <Styled.ArchivedTeamTitle>
                      {decodeBase64(archive?.Title)}
                    </Styled.ArchivedTeamTitle>
                  </Styled.ArchivedTeamDescription>
                  <Button
                    onClick={() => handleRecycle(archive)}
                    type="primary-o"
                    style={{
                      height: '1.5rem',
                      minWidth: '5rem',
                      textTransform: 'capitalize',
                    }}>
                    {RVDic?.Activate}
                  </Button>
                </Styled.ArchivedTeamWrapper>
                {self.length !== index + 1 && <hr className={BO_FREEZED} />}
              </Fragment>
            );
          })}
        </PerfectScrollbar>
      </Styled.ModalContentWrapper>
    </Modal>
  );
};

export default ArchivedModal;
