import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import * as Styled from 'views/Teams/Teams.styles';
import Modal from 'components/Modal/Modal';
import { TC_DEFAULT, BO_FREEZED, BG_GRAY_LIGHT } from 'constant/Colors';
import { decodeBase64 } from 'helpers/helpers';
import Button from 'components/Buttons/Button';
import Avatar from 'components/Avatar/Avatar';
import { recycleApplication } from 'store/actions/applications/ApplicationsAction';

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
      titleContainerClass={BG_GRAY_LIGHT}
      title={modalTitle}
      show={isOpen}
      onClose={onModalClose}>
      <Styled.ModalContentWrapper onScroll={(e) => console.log(e)}>
        {archives?.map((archive, index, self) => {
          return (
            <Fragment key={archive.ApplicationID}>
              <Styled.ArchivedTeamWrapper>
                <Styled.ArchivedTeamDescription>
                  <Avatar radius={30} userImage={archive.IconURL} />
                  <Styled.ArchivedTeamTitle>
                    {decodeBase64(archive.Title)}
                  </Styled.ArchivedTeamTitle>
                </Styled.ArchivedTeamDescription>
                <Button
                  onClick={() => recycleTeam(archive.ApplicationID)}
                  type="primary-o"
                  style={{ height: '1.5rem', width: '5rem' }}>
                  فعال سازی
                </Button>
              </Styled.ArchivedTeamWrapper>
              {self.length !== index + 1 && <hr className={BO_FREEZED} />}
            </Fragment>
          );
        })}
      </Styled.ModalContentWrapper>
    </Modal>
  );
};

export default ArchivedModal;
