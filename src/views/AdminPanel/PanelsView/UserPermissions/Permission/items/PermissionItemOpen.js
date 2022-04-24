import styled from 'styled-components';
import {
  CV_DISTANT,
  CV_GRAY,
  CV_RED,
  CV_WHITE,
  TCV_DEFAULT,
} from 'constant/CssVariables';
import OpenOutlineIcon from 'components/Icons/OpenOutlineIcon/OpenOutlineIcon';
import { useContext, useMemo, useRef, useState } from 'react';
import useOutsideClick from 'hooks/useOutsideClick';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import { PermissionContext } from '../Permissions';
import useWindowContext from 'hooks/useWindowContext';

const PermissionItemOpen = ({ ID, ...props }) => {
  const [show, setShow] = useState(false);
  const [userRole, setUserRole] = useState(true);
  const listEl = useRef();
  const { roles, permissions } = useContext(PermissionContext);
  const [roleSearchText, setRoleSearchTexts] = useState('');
  const { RV_RTL, RVDic } = useWindowContext();

  useOutsideClick(() => {
    setShow(false);
  }, listEl);

  const currentItemRoles = useMemo(() => {
    const current = [];
    permissions[ID]?.Audience?.forEach((x) => {
      const r = roles?.find((r) => r.RoleID === x);
      if (r) {
        current.push(r);
      }
    });
    return current;
  }, [roles]);

  const roleType = (type) => {
    return (
      currentItemRoles
        ?.filter((x) => x?.RoleType === type)
        ?.filter((x) => x?.RoleName.includes(roleSearchText))
        ?.map((x) => {
          const { RoleID } = x;
          return <RoleTitle key={RoleID} {...x} />;
        }) || []
    );
  };

  return (
    <OpenIconWrapper>
      <OpenButton onClick={() => setShow(true)}>
        <OpenOutlineIcon size={22} />
      </OpenButton>

      {show && (
        <PermissionListContainer ref={listEl} rtl={RV_RTL}>
          <TopRow>
            <TopRowButton
              highlight={userRole}
              onClick={() => setUserRole(true)}
            >
              {RVDic?.Users}
            </TopRowButton>
            <TopRowButton
              highlight={!userRole}
              onClick={() => setUserRole(false)}
            >
              {RVDic?.Groups}
            </TopRowButton>

            <CloseButton onClick={() => setShow(false)} rtl={RV_RTL}>
              <CloseIcon size={14} />
            </CloseButton>
          </TopRow>

          <BodyContainer>
            <InputWrapper>
              <Input
                placeholder={RVDic.Search}
                value={roleSearchText}
                onChange={(e) => setRoleSearchTexts(e?.target?.value)}
              />
              <SearchIcon />
            </InputWrapper>

            <RoleListContainer>
              {userRole && roleType('User')}

              {!userRole && roleType('Node')}
            </RoleListContainer>
          </BodyContainer>
        </PermissionListContainer>
      )}
    </OpenIconWrapper>
  );
};

const RoleTitle = ({ IconURL, RoleName }) => {
  return (
    <TitleContainer>
      <Thumbnail src={IconURL} />
      <RoleNameTitle>{RoleName}</RoleNameTitle>
    </TitleContainer>
  );
};

const OpenIconWrapper = styled.div`
  display: flex;
  height: 4rem;
  flex: 0 0 4rem;
  justify-content: center;
  align-items: center;
  position: relative;
`;
const OpenButton = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background-color: ${CV_WHITE};
  color: ${CV_DISTANT};
  cursor: pointer;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    border: 1px solid ${CV_DISTANT};
  }

  &:hover {
    color: ${TCV_DEFAULT};
  }
`;
const PermissionListContainer = styled.div`
  position: absolute;
  background-color: ${CV_WHITE};
  height: 18.75rem;
  width: 19.125rem;
  border-radius: 0.8rem;
  box-shadow: 1px 5px 20px #0000001f;
  top: 1rem;
  ${({ rtl }) => (rtl ? 'left' : 'right')}: 1.2rem;
  z-index: 100;
`;

const TopRow = styled.div`
  width: 100%;
  height: 2.5rem;
  border-bottom: 1px solid ${CV_DISTANT};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  gap: 0.5rem;
  padding: 0 1rem;
`;
const TopRowButton = styled.div`
  height: 2.5rem;
  line-height: 2.5rem;
  ${(props) => props?.highlight && `border-bottom: 3px solid ${TCV_DEFAULT}`};
  color: ${(props) => (props?.highlight ? TCV_DEFAULT : CV_DISTANT)};
  padding: 0 1rem;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
`;
const CloseButton = styled.div`
  position: absolute;
  ${({ rtl }) => (rtl ? 'left' : 'right')}: 0.5rem;
  height: 2rem;
  width: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${CV_RED};
  cursor: pointer;
`;
const BodyContainer = styled.div`
  padding: 1rem;
  overflow: hidden !important;
  height: 15.5rem;
`;
const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  height: 1.8rem;
  border-bottom: 1px solid ${CV_DISTANT};
  color: ${CV_DISTANT};
`;
const Input = styled.input`
  border: none;
  outline: none;
  color: ${CV_DISTANT};
  font-size: 0.75rem;

  &::placeholder {
    color: ${CV_DISTANT};
    font-size: 0.75rem;
  }
`;

const RoleListContainer = styled.div`
  margin-top: 0.5rem;
  height: 15rem;
  overflow: auto;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.625rem;
  height: 2.5rem;
`;

const Thumbnail = styled.img`
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 100%;
`;
const RoleNameTitle = styled.div`
  height: 1.5rem;
  line-height: 1.5rem;
  font-weight: 500;
  font-size: 0.8rem;
  color: ${CV_GRAY};
`;
export default PermissionItemOpen;
