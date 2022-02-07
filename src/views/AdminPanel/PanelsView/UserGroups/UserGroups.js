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

const UserGroups = () => {
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
    await removeNode(nodeId);
    const groups = await getGroupsAll();
    setGroups(groups);
  };

  const groupItems = useMemo(
    () =>
      groups
        ?.filter((x) => x?.Name.includes(searchText))
        ?.map((x) => (
          <GroupItem key={x?.NodeID}>
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

  const search = (e) => {
    console.log(e);
    // setSearchText(e?.target?.value)
  };

  return (
    <Styled.UserGroupsContainer rtl={RV_RTL}>
      <Styled.UserGroupsContent>
        <Breadcrumb items={breadcrumbs} />

        <Styled.GroupsContainer>
          <Styled.HeadingWrapper>{RVDic.Groups}</Styled.HeadingWrapper>

          <SearchInput
            placeholder={RVDic.Search}
            value={searchText}
            onChange={(e) => search(e)}
          />

          {!loading ? (
            <Styled.GroupsCardContainer>
              {groupItems}
              <UserGroupUpsertModal
                createMode={true}
                typeId={NodeTypeID}
                users={allUsers}
                onModalConfirm={handleModalConfirm}
                onModalDelete={handleModalDelete}
              />
            </Styled.GroupsCardContainer>
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
