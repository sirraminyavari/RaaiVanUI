import * as Styled from './UserGroupsStyles';
import useWindowContext from 'hooks/useWindowContext';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import SearchIcon from 'components/Icons/SearchIcon/Search';
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
import { catchError, first, from, of, switchMap, tap } from 'rxjs';
import PeopleIcon from 'components/Icons/PeopleIcon/PeopleIcon';

const modifyNodeName$ = (name, id) => from(modifyNodeName(name, id));
const saveMember$ = (id, userIds) => from(saveMembers(id, userIds));
const addNode$ = (name, nodeTypeId) => from(addNode(name, nodeTypeId));
const removeNode$ = (nodeId) => from(removeNode(nodeId));

const UserGroups = () => {
  const { RVDic, RV_RTL } = useWindowContext();
  const [groups, setGroups] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [NodeTypeID, setNodeTypeID] = useState('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    getGroupsAll()
      .then((x) => {
        setNodeTypeID(x[0]?.NodeTypeID);
        setGroups(x);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });

    getUsers('', true)
      .then((res) => {
        setAllUsers(res);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleModalConfirm = (name, users, nodeId) => {
    const userIds = users.map((x) => x?.UserID);
    if (nodeId) {
      modifyNodeName$(name, nodeId)
        .pipe(
          first(),
          switchMap(() =>
            saveMember$(nodeId, userIds).pipe(
              switchMap(() =>
                from(getGroupsAll()).pipe(
                  tap((x) => {
                    setGroups(x);
                  })
                )
              )
            )
          ),
          catchError((err) => {
            console.log(err);
            return of(err);
          })
        )
        .subscribe();
    } else {
      addNode$(name, NodeTypeID)
        .pipe(
          first(),
          switchMap((x) =>
            saveMember$(x?.Node?.NodeID, userIds).pipe(
              switchMap(() =>
                from(getGroupsAll()).pipe(
                  tap((x) => {
                    setGroups(x);
                  })
                )
              )
            )
          ),
          catchError((err) => {
            console.log(err);
            return of(err);
          })
        )
        .subscribe();
    }
  };

  const handleModalDelete = (nodeId) => {
    removeNode$(nodeId)
      .pipe(
        first(),
        switchMap(() =>
          from(getGroupsAll()).pipe(
            tap((x) => {
              setGroups(x);
            })
          )
        ),
        catchError((err) => {
          console.log(err);
          return of(err);
        })
      )
      .subscribe();
  };

  const groupItems = useMemo(
    () =>
      groups
        ?.filter((x) => x?.Name.includes(searchText))
        ?.map((x) => (
          <GroupItem key={x?.NodeID}>
            <Styled.GroupIconContainer>
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
      title: 'گروه های کاربری',
      linkTo: 'usergroups',
    },
  ];

  return (
    <Styled.UserGroupsContainer rtl={RV_RTL}>
      <Styled.UserGroupsContent>
        <Breadcrumb items={breadcrumbs} />

        <Styled.GroupsContainer>
          <Styled.HeadingWrapper>{'گروه های کاربری'}</Styled.HeadingWrapper>
          <Styled.InputContainer>
            <Styled.Input
              placeholder={'فیلتر بر اساس نام گروه'}
              value={searchText}
              onChange={(e) => setSearchText(e)}
            />
            <SearchIcon size={30} />
          </Styled.InputContainer>

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
