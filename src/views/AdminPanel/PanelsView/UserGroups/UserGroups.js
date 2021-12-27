import * as Styled from './UserGroupsStyles';
import useWindowContext from 'hooks/useWindowContext';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import { useEffect, useMemo, useState } from 'react';
import { getGroupsAll } from 'apiHelper/ApiHandlers/CNApi';
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

  const handleModalClose = (state, users) => {
    switch (state) {
      case 'delete':
        break;
      case 'confirm':
        break;
      default:
      // close
    }

    //reload groups
  };

  const groupItems = useMemo(
    () =>
      groups?.map((x) => (
        <GroupItem key={x?.NodeID}>
          <GroupItemTitle>{x?.Name}</GroupItemTitle>
          <GroupItemActionBar>
            <UserGroupMembers members={x?.Members} />
            <UserGroupUpsertModal
              group={x}
              typeId={NodeTypeID}
              createMode={false}
              users={allUsers}
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
              onChange={(e) => setSearchText(e?.target?.value)}
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
              />
            </Styled.GroupsCardContainer>
          ) : (
            <LogoLoader />
          )}
        </Styled.GroupsContainer>

        <Styled.GroupsExcerpt>
          <Styled.ExcerptImage src={groupImg} />
        </Styled.GroupsExcerpt>
      </Styled.UserGroupsContent>
    </Styled.UserGroupsContainer>
  );
};
export default UserGroups;
