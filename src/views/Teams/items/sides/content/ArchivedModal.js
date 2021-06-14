import * as Styled from 'views/Teams/Teams.styles';
import Modal from 'components/Modal/Modal';
import { TC_DEFAULT, BO_FREEZED, BG_GRAY_LIGHT } from 'constant/Colors';
import { decodeBase64 } from 'helpers/helpers';
import Button from 'components/Buttons/Button';
import Avatar from 'components/Avatar/Avatar';

const ArchivedModal = (props) => {
  const { isOpen, onArchiveClose, modalTitle, modalWidth, archives } = props;

  return (
    <Modal
      titleClass={TC_DEFAULT}
      contentWidth={modalWidth}
      titleContainerClass={BG_GRAY_LIGHT}
      title={modalTitle}
      show={isOpen}
      onClose={onArchiveClose}>
      <Styled.ModalContentWrapper>
        {archives.map((archive, index, self) => {
          return (
            <>
              <div
                key={archive.ApplicationID}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  margin: '1rem 0',
                }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    flexGrow: 1,
                  }}>
                  <Avatar radius={30} userImage={archive.IconURL} />
                  <span style={{ margin: '0 1rem' }}>
                    {decodeBase64(archive.Title)}
                  </span>
                </div>
                <div>
                  <Button
                    type="primary-o"
                    style={{ height: '1.5rem', width: '5rem' }}>
                    فعال سازی
                  </Button>
                </div>
              </div>
              {self.length !== index + 1 && <hr className={BO_FREEZED} />}
            </>
          );
        })}
      </Styled.ModalContentWrapper>
    </Modal>
  );
};

export default ArchivedModal;
