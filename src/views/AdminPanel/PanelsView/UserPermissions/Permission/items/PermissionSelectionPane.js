import styled from 'styled-components';
import * as Styled from '../PermissionStyle';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import { useState } from 'react';
import { CV_DISTANT } from 'constant/CssVariables';
import PermissionItem from './PermissionItem';

const PermissionSelectionPane = ({ sections }) => {
  const [permissionSearchText, setPermissionSearchText] = useState('');

  const items = sections[0]?.Items?.filter((x) =>
    x?.Title?.includes(permissionSearchText)
  )?.map((x) => <PermissionItem key={x.ID} {...x} />);

  return (
    <PermissionContainer>
      <SearchBoxWrapper>
        <Styled.RoleSearchBox>
          <Styled.RoleInput
            placeholder={'فیلتر بر اساس نام دسترسی'}
            type="text"
            value={permissionSearchText}
            onChange={(e) => setPermissionSearchText(e?.target?.value)}
          />
          <SearchIcon size={20} />
        </Styled.RoleSearchBox>
      </SearchBoxWrapper>

      <ListHeader>
        <SelectAllWrapper>همه</SelectAllWrapper>
        <PermissionHeaderTitle>دسترسی</PermissionHeaderTitle>
        <OpenHeaderTitle>مشاهده</OpenHeaderTitle>
      </ListHeader>

      <PermissionBody>{items}</PermissionBody>
    </PermissionContainer>
  );
};

const PermissionContainer = styled.div`
  margin-top: 2.5rem;
  position: relative;
`;

const SearchBoxWrapper = styled.div`
  width: 29rem;
`;

const ListHeader = styled.div`
  margin-top: 2.5rem;
  display: flex;
  height: 3rem;
  padding: 0.8rem;
  border-bottom: 1px solid ${CV_DISTANT};
`;
const PermissionHeader = styled.div`
  position: sticky;
  top: 0;
`;
const SelectAllWrapper = styled.div`
  flex: 0 0 6rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const PermissionHeaderTitle = styled.div`
  flex: 1;
  padding-right: 2.5rem;
  font-size: 0.8rem;
  height: 1.5rem;
  line-height: 1.5rem;
  color: ${CV_DISTANT};
`;
const OpenHeaderTitle = styled.div`
  flex: 0 0 6rem;
  text-align: center;
  font-size: 0.8rem;
  height: 1.5rem;
  line-height: 1.5rem;
  color: ${CV_DISTANT};
`;

const PermissionBody = styled.div`
  overflow: auto;
  height: calc(100vh - 27rem);

  &::-webkit-scrollbar {
    width: 0.5rem;
  }
`;
export default PermissionSelectionPane;
