import { useContext, useEffect, useState } from 'react';
import { PermissionContext } from '../Permissions';
import { getChildNodes, getNodeTypes } from '../../api';
import AddIcon from 'components/Icons/AddIcon/AddIcon';
import Modal from 'components/Modal/Modal';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import Button from 'components/Buttons/Button';
import styled from 'styled-components';
import {
  CV_DISTANT,
  CV_GRAY,
  CV_GRAY_LIGHT,
  CV_WHITE,
  TCV_DEFAULT,
} from 'constant/CssVariables';
import SearchInput from '../../../Users/items/SearchInput';
import useLazyPaginatedTree from './LazyPaginatedTree';
import LazyTreeNode from './LazyTreeNode';
import { decodeBase64, getUUID } from 'helpers/helpers';
import PeopleOutlineIcon from 'components/Icons/PeopleOutlineIcon/PeopleOutlineIcon';

const GroupSelectModal = () => {
  const FETCH_DATA_COUNT = 12;
  const { roles, setRoles } = useContext(PermissionContext);
  const [modalInfo, setModalInfo] = useState({
    title: 'انتخاب گروه کاربری',
    contentWidth: '35%',
    middle: true,
    show: false,
    titleClass: 'rv-default',
    titleContainerClass: 'modal-title-bar',
  });
  const [searchNewRole, setSearchNewRole] = useState('');

  const {
    root,
    setRoot,
    selectedNode,
    handleResetSelectedNode,
    updateNodeChildren,
    setNodeLoadingState,
    setNodeOpenState,
    setNodeOpenLoading,
    handleNodeSelection,
  } = useLazyPaginatedTree();

  const loadGroupRoots = () => {
    getNodeTypes().then((res) => {
      const modifiedResponse = res.map((x) => ({
        ...x,
        Name: x?.TypeName,
      }));
      setRoot(modifiedResponse);
    });
  };

  useEffect(() => {
    loadGroupRoots();
  }, [searchNewRole]);

  const onModalCancel = () => {
    handleResetSelectedNode();
    setModalInfo({ ...modalInfo, show: false });
  };

  const onModalConfirm = () => {
    const mappedToRoles = selectedNode.map((x) => ({
      RoleID: x?.NodeID,
      AdditionalID: x?.AdditionalID,
      IconURL: '../../images/Preview.png',
      RoleName: x?.Name,
      RoleType: 'Node',
      Permissions: 0,
    }));

    const nextRoles = [...roles];
    mappedToRoles.forEach((role) => {
      const exist = roles.find((x) => x.RoleID === role.RoleID);
      if (!exist) {
        nextRoles.push(role);
      }
    });
    setRoles(nextRoles);
    handleResetSelectedNode();
    setModalInfo({ ...modalInfo, show: false });
  };

  const selectNode = (node) => {
    handleNodeSelection(node);
  };

  const handleOpenNode = (node) => {
    if (!node?.isOpen) {
      if (node?.hasChildren && node?.items?.length !== 0) {
        // open node without fetching data
        setNodeOpenState(node?.id, true);
      } else if (node?.hasChildren && node?.items?.length === 0) {
        // set open: true and loading: true
        setNodeOpenLoading(node?.id);
        fetchData(node);
      }
    } else {
      // the node is open already, so just close it
      setNodeOpenState(node?.id, false);
    }
  };

  const loadMore = (node) => {
    // set open: true and loading: true
    setNodeOpenLoading(node?.id);
    fetchData(node);
  };

  const fetchData = (node) => {
    let LowerBoundary = 1;
    if (node?.items?.length !== 0) {
      LowerBoundary = node?.items?.length + 1;
    }
    let hasMore = true;
    // then fetch data from api and update children and finally set loading: false
    getChildNodes(
      node?.NodeTypeID,
      node?.NodeID,
      node?.SearchText,
      FETCH_DATA_COUNT,
      LowerBoundary
    )
      .then((res) => {
        hasMore =
          res?.TotalCount - res?.Nodes?.length - node?.items?.length > 0
            ? true
            : false;
        return res?.Nodes;
      })
      .then((res) =>
        res.map((x) => ({
          ...x,
          Name: decodeBase64(x.Name),
          NodeType: decodeBase64(x.NodeType),
        }))
      )
      .then((res) => {
        const modifiedRes = res.map((x) => ({
          ...x,
          selectable: true,
          id: getUUID(),
          items: [],
          isOpen: false,
          isLoading: false,
          isSelected: false,
          hasChildren: x?.HasChild,
          SearchText: '',
        }));
        updateNodeChildren(node?.id, modifiedRes, hasMore);
      });
  };

  return (
    <DialogContainer>
      <ModalButton onClick={(e) => setModalInfo({ ...modalInfo, show: true })}>
        <AddIcon circleOutline={true} size={20} />
        <div>افزودن</div>
      </ModalButton>
      <Modal {...modalInfo} onClose={onModalCancel}>
        <ModalMessage>
          {'کاربران گروه‌های انتخاب شده به مدیریت مستندات دسترسی خواهند داشت:'}
        </ModalMessage>

        <SearchRoleInput>
          <CustomRole
            type="text"
            delayTime={1000}
            defaultValue={searchNewRole}
            onChange={(value) => setSearchNewRole(value)}
            placeholder={'برای افزودن گروه، نام گروه را جستجو کنید...'}
          />
          <SearchIcon size={20} />
        </SearchRoleInput>

        <ModalRoleSelectionContainer>
          <RootTree>
            {root?.items.map((x) => {
              return (
                <LazyTreeNode
                  key={x.id}
                  {...x}
                  openNode={handleOpenNode}
                  selectNode={selectNode}
                  loadMore={loadMore}
                />
              );
            })}
          </RootTree>
        </ModalRoleSelectionContainer>

        <HintContainer>
          <PeopleOutlineIcon size={16} />
          <div>{'موارد که علامت گروه را ندارند، قابل انتخاب نیستند'}</div>
        </HintContainer>

        <ActionButtonContainer>
          <Button type="primary" style={buttonStyles} onClick={onModalConfirm}>
            {'ذخیره'}
          </Button>

          <Button
            type="negative-o"
            style={buttonStyles}
            onClick={onModalCancel}>
            {'بازگشت'}
          </Button>
        </ActionButtonContainer>
      </Modal>
    </DialogContainer>
  );
};
const DialogContainer = styled.div``;
const ModalButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  height: 2rem;
  width: 7.5rem;
  border-radius: 1rem;
  background-color: ${TCV_DEFAULT};
  color: ${CV_WHITE};
  cursor: pointer;
  user-select: none;
`;

const ModalMessage = styled.div`
  height: 1.4rem;
  line-height: 1.4rem;
  color: ${CV_GRAY};
  margin: 1.8rem 0 1.5rem 0;
`;
const ActionButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
`;
const SearchRoleInput = styled.div`
  width: 100%;
  height: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${CV_DISTANT};
  border-radius: 0.5rem;
  margin-bottom: 0.625rem;
  overflow: hidden;
  color: ${CV_DISTANT};
  padding: 0.75rem;
`;
const ModalRoleSelectionContainer = styled.div`
  background-color: ${CV_GRAY_LIGHT};
  padding: 0.5rem;
  border-raduis: 0.5rem;
  margin-bottom: 1.5rem;
  height: 25rem;
  overflow: auto;
`;
const CustomRole = styled(SearchInput)`
  border: none !important;
  outline: none !important;
  width: 100%;
`;
const buttonStyles = {
  height: '3rem',
  width: '7.5rem',
};
const RootTree = styled.ul`
  list-style: none;
  padding: 0 1.5rem;
`;
const HintContainer = styled.div`
  height: 1rem;
  line-height: 1rem;
  margin: 1.2rem 0 2.3rem 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.625rem;
  color: ${CV_DISTANT};
`;
export default GroupSelectModal;