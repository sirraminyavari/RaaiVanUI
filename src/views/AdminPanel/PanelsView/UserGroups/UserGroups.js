import * as Styled from './UserGroupsStyles';
import useWindowContext from 'hooks/useWindowContext';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import SearchIcon from 'components/Icons/SearchIcon/Search';

const UserGroups = () => {
  const { RVDic, RV_RTL } = useWindowContext();

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

          <Styled.GroupsCardContainer>
            <Styled.DashedBox></Styled.DashedBox>
          </Styled.GroupsCardContainer>
        </Styled.GroupsContainer>

        <Styled.GroupsExcerpt></Styled.GroupsExcerpt>
      </Styled.UserGroupsContent>
    </Styled.UserGroupsContainer>
  );
};
export default UserGroups;
