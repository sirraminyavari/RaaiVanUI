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
import AddIcon from '../../../../components/Icons/AddIcon/AddIcon';

const UserGroups = () => {
  const { RVDic, RV_RTL } = useWindowContext();

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [NodeTypeID, setNodeTypeID] = useState('');

  useEffect(() => {
    getGroupsAll()
      .then((x) => {
        console.log(x);
        setNodeTypeID(x[0]?.NodeTypeID);
        setGroups(x);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const groupItems = useMemo(
    () =>
      groups.map((x) => (
        <GroupItem key={x?.NodeID}>
          <GroupItemTitle>{x?.Name}</GroupItemTitle>
          <GroupItemActionBar>
            <UserGroupMembers members={x?.Members} />
            <UserGroupUpsertModal
              group={x}
              typeId={NodeTypeID}
              createMode={false}
            />
          </GroupItemActionBar>
        </GroupItem>
      )),
    [groups]
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
            <Styled.Input placeholder={'فیلتر بر اساس نام گروه'} />
            <SearchIcon size={30} />
          </Styled.InputContainer>

          {!loading ? (
            <Styled.GroupsCardContainer>
              {groupItems}
              <UserGroupUpsertModal createMode={true} typeId={NodeTypeID} />
            </Styled.GroupsCardContainer>
          ) : (
            <LogoLoader />
          )}
        </Styled.GroupsContainer>

        <Styled.GroupsExcerpt></Styled.GroupsExcerpt>
      </Styled.UserGroupsContent>
    </Styled.UserGroupsContainer>
  );
};
export default UserGroups;
