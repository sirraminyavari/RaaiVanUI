import { Fragment } from 'react';
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

const ArchivedModal = (props) => {
  const dispatch = useDispatch();
  const {
    isOpen,
    onModalClose,
    modalTitle,
    modalWidth,
    archives,
    contentClass,
  } = props;

  const { RVDic } = useWindow();

  const onRecycleDone = (message) => {
    // console.log(message);
  };

  const recycleTeam = (teamId) => {
    dispatch(recycleApplication(teamId, onRecycleDone, true));
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
                    onClick={() => recycleTeam(archive?.ApplicationID)}
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
