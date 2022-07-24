import React, { useEffect, useState } from 'react';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import useWindow from 'hooks/useWindowContext';
import Heading from 'components/Heading/Heading';
import SearchInput from 'components/Inputs/SearchInput';
import { decodeBase64 } from 'helpers/helpers';
import Avatar from 'components/Avatar/Avatar';
import DeleteConfirmModal from 'components/Modal/DeleteConfirm';
import LoadingIconCircle from 'components/Icons/LoadingIcons/LoadingIconFlat';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import InfiniteScroll from 'components/InfiniteScroll/InfiniteScroll';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import ResponsiveTable from 'views/Teams/items/others/table/ResponsiveTable';
import * as GlobalStyled from 'views/Teams/Teams.styles';
import * as Styled from './WorkspaceUserManagement.styles';
import {
  WORKSPACES_PATH,
  WORKSPACE_USER_MANAGEMENT_PATH,
} from 'views/Teams/items/others/constants';
import { removeWorkspaceUser } from 'apiHelper/ApiHandlers/RVAPI';
import { getWorkspaceUsers } from 'apiHelper/ApiHandlers/usersApi';
import WorkspaceUserManagementTableData from './WorkspaceUserManagementTableData';
import WorkspaceUserManagementTableColumnHead from './WorkspaceUserManagementTableColumnHead';
import ReturnButton from 'components/Buttons/ReturnButton';
import { useHistory } from 'react-router-dom';

const WorkspaceUserManagement = ({ WorkspaceID }) => {
  const { RVDic, GlobalUtilities } = useWindow();
  const { isMobile } = DimensionHelper();
  const history = useHistory();
  const [SearchText, setSearchText] = useState('');
  const [tablePage, setTablePage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [workspaceUsers, setWorkspaceUsers] = useState([]);
  const [removableUser, setRemovableUser] = useState(false);

  //! RVDic i18n variables
  const RVDicWorkspaceSettings = RVDic.SettingsOfN.replace(
    '[n]',
    RVDic.Workspace
  );
  const RVDicUserManagement = RVDic.ManageN.replace('[n]', RVDic.Users);
  const RVDicRemoveFromAllTeams = RVDic.RemoveFromAllTeams;
  const RVDicSearch = RVDic.Search;
  const RVDicReturn = RVDic.Return;
  const RVDicConfirm = RVDic.Confirm;
  const RVDicRemoveUserFormTeams = RVDic.Confirms.DoYouWantToRemoveN.replace(
    '[n]',
    RVDic.User
  );
  const RVDicRemoveUserFormTeamsInfo = RVDic._HelpRemoveUser;

  const breadCrumbItems = [
    {
      id: 1,
      title: RVDicWorkspaceSettings,
      linkTo: WORKSPACES_PATH,
    },
    {
      id: 2,
      title: RVDicUserManagement,
      linkTo: `${WORKSPACE_USER_MANAGEMENT_PATH}/${WorkspaceID}`,
    },
  ];

  const returnToWorkspacesView = () => history.push(WORKSPACES_PATH);

  //! API request handler
  const loadWorkspaceUsers = React.useMemo(
    () =>
      async (resetTable = false) => {
        if (isLoading) return;
        setIsLoading(true);
        const { ErrorText, ...response } = await getWorkspaceUsers({
          WorkspaceID,
          Count: 20,
          SearchText: SearchText,
          LowerBoundary: workspaceUsers?.length + 1,
        });
        if (ErrorText)
          return InfoToast({
            type: 'error',
            message: RVDic.MSG[ErrorText] || ErrorText,
          });
        setIsLoading(false);
        setWorkspaceUsers((storedUsers) => [
          //* If [resetTable] is true, then only return recently fetched Users
          //* if false, then merge recently fetched data with previous items
          ...(resetTable ? [] : storedUsers),
          ...response.Items,
        ]);

        if (resetTable) {
          setTablePage(0);
        } else if (response.TotalCount > workspaceUsers.length + 1)
          setTablePage((currentPage) => currentPage + 1);
        else setTablePage(false);
        console.log({ SearchText });
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workspaceUsers, SearchText, isLoading]
  );

  //! reset the Workspace Users on SearchText changes
  useEffect(() => {
    setWorkspaceUsers([]);
    setTablePage(0);
  }, [SearchText]);

  //! Build a template for every row of workspace users (react-table)
  const data = React.useMemo(
    () =>
      WorkspaceUserManagementTableData({
        workspaceUsers,
        isMobile,
        setRemovableUser,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workspaceUsers, tablePage, isMobile]
  );

  //! Setup workspace user's table headers
  const columns = React.useMemo(
    () => WorkspaceUserManagementTableColumnHead({ isMobile }),
    [isMobile]
  );

  //! handling the removal of the selected user from workspace
  const removeUserFromWorkspace = async () => {
    const { UserID } = removableUser;
    const { ErrorText, Succeed } = await removeWorkspaceUser({
      UserID,
      WorkspaceID,
    });

    if (ErrorText)
      return InfoToast({
        type: 'error',
        message: RVDic.MSG[ErrorText] || ErrorText,
      });
    setRemovableUser(false);
    InfoToast({
      type: 'success',
      message: RVDic.MSG[Succeed] || Succeed,
    });
  };

  return (
    <>
      <div>
        <DeleteConfirmModal
          cancelText={RVDicReturn}
          confirmText={RVDicConfirm}
          messageIcon={() => (
            <Avatar
              imageClasses="teamAvatar"
              userImage={GlobalUtilities.add_timestamp(removableUser.ImageURL)}
            />
          )}
          show={!!removableUser}
          onConfirm={removeUserFromWorkspace}
          onCancel={() => setRemovableUser(false)}
          onClose={() => setRemovableUser(false)}
          messageQuestion={RVDicRemoveUserFormTeams}
          messageWarning={RVDicRemoveUserFormTeamsInfo}
          title={RVDicRemoveFromAllTeams}
          messageTitle={decodeBase64(removableUser.FullName)}
        />

        <GlobalStyled.WorkspaceSettingsHeaderContainer>
          <div>
            <Breadcrumb className="breadcrumb" items={breadCrumbItems} />
            <Heading type="h1" className="pageTitle">
              {RVDicUserManagement}
            </Heading>
          </div>
          <ReturnButton onClick={returnToWorkspacesView} />
        </GlobalStyled.WorkspaceSettingsHeaderContainer>
        <SearchInput
          placeholder={RVDicSearch}
          onChange={(event) => setSearchText(event.target.value)}
          delayTime={650}
          defaultValue={''}
        />

        <Styled.WorkspaceUserManagementTableContainer>
          <InfiniteScroll
            onScrollEnd={loadWorkspaceUsers}
            pageNumber={tablePage}
            setPageNumber={setTablePage}
            hasMore={tablePage !== false}
          >
            <ResponsiveTable data={data} columns={columns} />
          </InfiniteScroll>
          <Styled.WorkspaceUserManagementLoaderContainer>
            {isLoading && <LoadingIconCircle />}
          </Styled.WorkspaceUserManagementLoaderContainer>
        </Styled.WorkspaceUserManagementTableContainer>
      </div>
    </>
  );
};

export default WorkspaceUserManagement;
