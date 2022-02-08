import * as Styled from './UserGroupsStyles';
import useWindow from 'hooks/useWindowContext';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import { useEffect, useMemo, useState } from 'react';
import {
  addNode,
  getGroupsAll,
  modifyNodeName,
  removeNode,
  saveMembers,
} from 'apiHelper/ApiHandlers/CNApi';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import {
  GroupItem,
  GroupItemActionBar,
  GroupItemTitle,
} from './UserGroupsStyles';
import UserGroupMembers from './items/UserGroupMembers';
import UserGroupUpsertModal from './items/UserGroupUpsertModal';
import { getUsers } from 'apiHelper/ApiHandlers/usersApi';
import groupImg from 'assets/images/groups.png';
import PeopleIcon from 'components/Icons/PeopleIcon/PeopleIcon';
import SearchInput from 'components/Inputs/SearchInput';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const UserGroups = () => {
  const listAnimationDuration = 150;
  const { RVDic, RV_RTL } = useWindow();
  const [groups, setGroups] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [NodeTypeID, setNodeTypeID] = useState('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    (async () => {
      const groups = await getGroupsAll();
      setNodeTypeID(groups[0]?.NodeTypeID);
      setGroups(groups);
      setLoading(false);

      const users = await getUsers('', true);
      setAllUsers(users);
    })();
  }, []);

  /**
   * @description modify groups on modal confirm
   * @param name
   * @param users
   * @param nodeId
   * @returns {Promise<void>}
   */
  const handleModalConfirm = async (name, users, nodeId) => {
    const userIds = users.map((x) => x?.UserID);
    if (nodeId) {
      await modifyNodeName(name, nodeId);
      await saveMembers(nodeId, userIds);
      const groups = await getGroupsAll();
      setGroups(groups);
    } else {
      const node = await addNode(name, NodeTypeID);
      await saveMembers(node?.Node?.NodeID, userIds);
      const groups = await getGroupsAll();
      setGroups(groups);
    }
  };

  /**
   * @description delete group by nodeId
   * @param nodeId
   * @returns {Promise<void>}
   */
  const handleModalDelete = async (nodeId) => {
    const { ErrorText } = await removeNode(nodeId);
    if (ErrorText) {
      return InfoToast({
        type: 'error',
        message: RVDic.MSG[ErrorText] || ErrorText,
      });
    } else {
      const groups = await getGroupsAll();
      setGroups(groups);
    }
  };

  const groupItems = useMemo(
    () =>
      [...groups]
        ?.filter((x) => x?.Name.includes(searchText))
        ?.map((x) => (
          <CSSTransition
            key={x?.NodeID}
            timeout={listAnimationDuration}
            classNames="transition">
            <GroupItem>
              <Styled.GroupIconContainer rtl={RV_RTL}>
                <PeopleIcon size={96} />
              </Styled.GroupIconContainer>
              <GroupItemTitle>{x?.Name}</GroupItemTitle>
              <GroupItemActionBar>
                <UserGroupMembers members={x?.Members} />
                <UserGroupUpsertModal
                  group={x}
                  typeId={NodeTypeID}
                  createMode={false}
                  users={allUsers}
                  onModalConfirm={handleModalConfirm}
                  onModalDelete={handleModalDelete}
                />
              </GroupItemActionBar>
            </GroupItem>
          </CSSTransition>
        )),
    [groups, allUsers, searchText]
  );
  const breadcrumbs = [
    {
      id: 1,
      title: RVDic?.TeamManagement,
      linkTo: '',
    },
    {
      id: 2,
      title: RVDic?.UserManagement,
      linkTo: 'users',
    },
    {
      id: 3,
      title: RVDic?.Groups,
      linkTo: 'usergroups',
    },
  ];

  return (
    <Styled.UserGroupsContainer rtl={RV_RTL}>
      <Styled.UserGroupsContent>
        <Breadcrumb items={breadcrumbs} />

        <Styled.GroupsContainer>
          <Styled.HeadingWrapper>
            {RVDic?.ManageN.replace('[n]', RVDic.Groups)}
          </Styled.HeadingWrapper>

          <SearchInput
            placeholder={RVDic.Search}
            value={searchText}
            onChange={(e) => setSearchText(e?.target?.value)}
          />

          {!loading ? (
            <TransitionGroup
              duration={listAnimationDuration}
              component={Styled.GroupsCardContainer}>
              {groupItems}
              <UserGroupUpsertModal
                createMode={true}
                typeId={NodeTypeID}
                users={allUsers}
                onModalConfirm={handleModalConfirm}
                onModalDelete={handleModalDelete}
              />
            </TransitionGroup>
          ) : (
            <LogoLoader />
          )}
        </Styled.GroupsContainer>

        <Styled.GroupsExcerpt>
          <Styled.ExcerptImage src={groupImg} />
          <Styled.GroupDescriptionTitle>
            {RVDic?.WhatIsN.replace(`[n]`, RVDic.Group)}
          </Styled.GroupDescriptionTitle>
          <Styled.GroupDescription>
            {RVDic._HelpGroupsSAAS}
          </Styled.GroupDescription>
        </Styled.GroupsExcerpt>
      </Styled.UserGroupsContent>
    </Styled.UserGroupsContainer>
  );
};
export default UserGroups;
