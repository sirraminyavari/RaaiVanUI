import styled from 'styled-components';
import * as Styled from '../PermissionStyle';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import { useState } from 'react';
import { CV_DISTANT } from 'constant/CssVariables';

const PermissionSelectionPane = ({ items }) => {
  const [permissionSearchText, setPermissionSearchText] = useState('');
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
    </PermissionContainer>
  );
};

const PermissionContainer = styled.div`
  margin-top: 2.5rem;
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

export default PermissionSelectionPane;
