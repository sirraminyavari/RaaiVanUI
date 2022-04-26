import { useEffect, useMemo, useState } from 'react';
import { getGroupsAll } from 'apiHelper/ApiHandlers/CNApi';
import Modal from 'components/Modal/Modal';
import RVCheckbox from 'components/Inputs/RVCheckbox/RVCheckbox';
import MembersPreview from 'components/MembersPreview/MembersPreview';
import * as Styles from './GroupSelectInputStyles';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import Button from 'components/Buttons/Button';
import { IoChevronBackOutline, IoChevronForward } from 'react-icons/io5';
import { RiGroup2Fill } from 'react-icons/all';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';

const GroupSelectInput = ({ Groups, handleSelectedStateChange }) => {
  const { RVDic, RV_RTL } = window;
  const [loading, setLoading] = useState(true);
  const [modalInfo, setModalInfo] = useState({
    show: false,
    title: RVDic?.GroupsOfTheUser,
    middle: true,
    contentWidth: '28rem',
    titleClass: 'rv-default',
  });
  const [selectedGroups, setSelectedGroups] = useState(Groups);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const _groups = await getGroupsAll();
      setGroups(_groups);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleGroupSelect = (id, state) => {
    if (state) {
      setSelectedGroups([...selectedGroups, id]);
    } else {
      const removeID = selectedGroups?.filter((x) => x === id);
      setSelectedGroups(removeID);
    }
  };

  const handleItemRemove = (id) => {
    const removeID = selectedGroups?.filter((x) => x === id);
    setSelectedGroups(removeID);
  };

  const groupItems = useMemo(
    () =>
      groups.map((x) => {
        const { NodeID, Members, Name } = x;
        const members = Members.map((x) => ({
          title: x?.FullName,
          src: x?.ProfileImageURL,
        }));
        return (
          <Styles.ObjectItemContainer key={NodeID}>
            <RVCheckbox
              checked={selectedGroups?.includes(NodeID)}
              value={NodeID}
              onChange={(e) => {
                const { value, checked } = e?.target;
                handleGroupSelect(value, checked);
              }}
            >
              {Name}
            </RVCheckbox>
            <MembersPreview members={members} maxItems={4} size={2} />
          </Styles.ObjectItemContainer>
        );
      }),
    [selectedGroups, groups]
  );

  const selectedListItems = useMemo(() => {
    return selectedGroups.map((x) => {
      const { Name } = groups?.find((g) => g.NodeID === x) || {};
      return (
        <Styles.SelectItemContainer>
          <RiGroup2Fill size={20} />
          <Styles.SelectedItemTitle>{Name}</Styles.SelectedItemTitle>
          <Styles.SelectedItemRemove onClick={() => handleItemRemove(x)}>
            <CloseIcon size={20} outline={true} />
          </Styles.SelectedItemRemove>
        </Styles.SelectItemContainer>
      );
    });
  }, [selectedGroups]);

  const openModal = () => {
    setModalInfo({ ...modalInfo, show: true });
  };

  const closeModal = () => {
    setModalInfo({ ...modalInfo, show: false });
  };

  const confirmModal = () => {
    setModalInfo({ ...modalInfo, show: false });
    if (handleSelectedStateChange) {
      handleSelectedStateChange(selectedGroups);
    }
  };

  return loading ? (
    <LogoLoader />
  ) : (
    <>
      <Styles.UserInputContainer onClick={openModal}>
        <Styles.SelectedGroupContainer>
          {selectedListItems}
          <Styles.Input placeholder={'گروه کاربری خود را انتخاب کنید'} />
        </Styles.SelectedGroupContainer>
        <Styles.ButtonWrapper>
          <Styles.ArrowButton>
            {RV_RTL ? (
              <IoChevronBackOutline size={20} />
            ) : (
              <IoChevronForward size={20} />
            )}
          </Styles.ArrowButton>
        </Styles.ButtonWrapper>
      </Styles.UserInputContainer>
      <Modal {...modalInfo} onClose={closeModal}>
        <Styles.ObjectListWrapper>{groupItems}</Styles.ObjectListWrapper>
        <Styles.ModalActionBar>
          <Button
            type="primary"
            style={Styles.buttonStyles}
            onClick={() => confirmModal()}
          >
            {RVDic?.Save}
          </Button>

          <Button
            type="negative-o"
            style={Styles.buttonStyles}
            onClick={() => closeModal()}
          >
            {RVDic?.Return}
          </Button>
        </Styles.ModalActionBar>
      </Modal>
    </>
  );
};

export default GroupSelectInput;
