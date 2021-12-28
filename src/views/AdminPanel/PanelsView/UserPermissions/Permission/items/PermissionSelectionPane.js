import styled from 'styled-components';
import * as Styled from '../PermissionStyle';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import { useContext, useEffect, useMemo, useState } from 'react';
import { CV_DISTANT, TCV_DEFAULT } from 'constant/CssVariables';
import PermissionItem from './PermissionItem';
import { PermissionContext } from '../Permissions';
import DoubleCheck from 'components/Icons/CheckIcons/DoubleCheck';
import useWindowContext from 'hooks/useWindowContext';

const PermissionSelectionPane = ({ sections }) => {
  const [permissionSearchText, setPermissionSearchText] = useState('');
  const { RV_RTL, RVDic } = useWindowContext();
  const { selectedRole, permissions, updatePermission, roles } = useContext(
    PermissionContext
  );
  const [allSelected, setAllSelected] = useState(false);

  useEffect(() => {
    setAllSelected(() => {
      let result = true;
      if (selectedRole) {
        let count = 0;
        for (const key in permissions) {
          if (!permissions[key]?.Audience?.includes(selectedRole?.RoleID)) {
            result = false;
          }
          count++;
        }
        return result;
      }
      return false;
    });
  }, [permissions, selectedRole]);

  const items = useMemo(() => {
    return sections[0]?.Items?.filter((x) =>
      x?.Title?.includes(permissionSearchText)
    )?.map((x) => <PermissionItem key={x.ID} {...x} />);
  }, [roles, permissionSearchText]);

  const handleSelectAllClick = () => {
    if (!allSelected) {
      // select all
      let next = { ...permissions };
      for (const key in next) {
        if (
          !permissions[key]?.Audience?.find((x) => x === selectedRole.RoleID)
        ) {
          next = {
            ...next,
            [key]: {
              ...next[key],
              Audience: [...next[key]?.Audience, selectedRole.RoleID],
            },
          };
        }
      }
      updatePermission(next);
      setAllSelected(true);
    } else {
      // deselect all
      let next = { ...permissions };
      for (const key in next) {
        if (
          permissions[key]?.Audience?.find((x) => x === selectedRole.RoleID)
        ) {
          next = {
            ...next,
            [key]: {
              ...next[key],
              Audience: [...next[key]?.Audience].filter(
                (x) => x !== selectedRole.RoleID
              ),
            },
          };
        }
      }
      updatePermission(next);
      setAllSelected(false);
    }
  };

  return (
    <PermissionContainer>
      <SearchBoxWrapper>
        <Styled.RoleSearchBox>
          <Styled.RoleInput
            placeholder={RVDic.Search}
            type="text"
            value={permissionSearchText}
            onChange={(e) => setPermissionSearchText(e?.target?.value)}
          />
          <SearchIcon size={20} />
        </Styled.RoleSearchBox>
      </SearchBoxWrapper>

      <ListHeader>
        <SelectAllWrapper onClick={() => handleSelectAllClick()}>
          {allSelected && <DoubleCheck size={24} />}
          <div>{RVDic.All}</div>
        </SelectAllWrapper>
        <PermissionHeaderTitle rtl={RV_RTL}>
          {RVDic.Permissions}
        </PermissionHeaderTitle>
        <OpenHeaderTitle>{RVDic?.View}</OpenHeaderTitle>
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
const SelectAllWrapper = styled.div`
  flex: 0 0 6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid transparent;
  gap: 0.5rem;
  user-select: none;
  height: 2rem;
  line-height: 2rem;
  width: 5rem;
  border-radius: 1.5rem;
  color: ${TCV_DEFAULT};
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    border: 1px solid ${TCV_DEFAULT};
  }
`;
const PermissionHeaderTitle = styled.div`
  flex: 1;
  padding-${({ rtl }) => (rtl ? 'right' : 'left')}: 2.5rem;
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
  height: calc(100vh - 26rem);
  position: absolute;
  top: 8.6rem;
  width: 100%;
  left: 0;

  &::-webkit-scrollbar {
    width: 0.5rem;
  }
`;
export default PermissionSelectionPane;
