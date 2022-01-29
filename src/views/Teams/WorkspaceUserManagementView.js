import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import WelcomeLayout from 'layouts/WelcomeLayout';
import Heading from 'components/Heading/Heading';
import useWindow from 'hooks/useWindowContext';
import LoadingIconCircle from 'components/Icons/LoadingIcons/LoadingIconFlat';
import React, { useEffect, useState } from 'react';
import SearchInput from 'components/Inputs/SearchInput';
import APIHandler from 'apiHelper/APIHandler';
import { useParams } from 'react-router-dom';
import { decodeBase64, encodeBase64, randomNumber } from 'helpers/helpers';
import Avatar from 'components/Avatar/Avatar';
import InfiniteScroll from 'react-infinite-scroll-component';
import Tooltip from 'components/Tooltip/react-tooltip/Tooltip';
import PopupMenu from 'components/PopupMenu/PopupMenu';
import Badge from 'components/Badge/Badge';
import Button from 'components/Buttons/Button';
import DeleteConfirmModal from 'components/Modal/DeleteConfirm';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import ResponsiveTable from './items/others/table/ResponsiveTable';
import * as Styled from './Teams.styles';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import InfoToast from 'components/toasts/info-toast/InfoToast';
import { WORKSPACES_PATH } from './items/others/constants';

const getWorkspaceUsersAPI = new APIHandler('UsersAPI', 'GetWorkspaceUsers');
const removeUserFromWorkspaceAPI = new APIHandler(
  'RVAPI',
  'RemoveUserFromWorkspace'
);

const WorkspaceSettingsView = () => {
  const { id: WorkspaceID } = useParams();
  const { RVDic } = useWindow();
  const { isMobile } = DimensionHelper();
  const [SearchText, setSearchText] = useState('');
  const [tablePage, setTablePage] = useState(0);
  const [InfiniteScrollRerenderer, setInfiniteScrollRerenderer] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [workspaceUsers, setWorkspaceUsers] = useState([]);
  const [removableUser, setRemovableUser] = useState(false);

  const breadCrumbItems = [
    {
      id: 1,
      title: RVDic.SettingsOfN.replace('[n]', RVDic.Workspace),
      linkTo: WORKSPACES_PATH,
    },
    {
      id: 2,
      title: RVDic.ManageN.replace('[n]', RVDic.Users),
      // linkTo: '/workspaces/settings/user-management',
    },
  ];

  //! API request handler
  const getWorkspaceUsers = React.useMemo(
    () => (resetTable = false) => {
      setIsLoading(true);
      if (isLoading) return;

      getWorkspaceUsersAPI.fetch(
        {
          WorkspaceID,
          Count: 2,
          SearchText: encodeBase64(SearchText),
          LowerBoundary: workspaceUsers?.length + 1,
        },
        ({ ErrorText, ...response }) => {
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
        }
      );
    },
    [workspaceUsers, SearchText]
  );
  //! fetch first batch of workspace users on page load
  useEffect(() => {
    getWorkspaceUsers(true);
  }, []);

  //! reset the Workspace Users on SearchText changes
  useEffect(() => {
    setWorkspaceUsers([]);
    setTablePage(0);
    //? simple hack to make InfiniteScroll component fetch on search input changes
    window.scrollTo(0, 0);
    window.scrollTo(0, 10);
    setInfiniteScrollRerenderer(randomNumber());
  }, [SearchText]);

  //! Build a template for every row of workspace users (react-table)
  const data = React.useMemo(
    () =>
      workspaceUsers?.map(({ Applications, User }) => {
        return {
          col1: (
            <>
              <Avatar className="userAvatar" userImage={User.ImageURL} />
              {decodeBase64(User.FullName)}
            </>
          ),
          //* remove [col2] and [col3] of the table on mobile view
          ...(!isMobile && {
            col2: decodeBase64(User.MainEmailAddress),
            col3: decodeBase64(User.LastActivityTime_Local),
          }),
          col4: Applications.map(
            ({ ApplicationID, Title, IconURL }, idx, ApplicationsArray) => {
              if (idx < 5)
                return (
                  <Tooltip
                    effect="solid"
                    place="bottom"
                    tipId={ApplicationID}
                    key={ApplicationID || idx}
                    renderContent={() => decodeBase64(Title)}>
                    <Avatar imageClasses="teamAvatar" userImage={IconURL} />
                  </Tooltip>
                );
              else if (idx === 5)
                return (
                  <>
                    <PopupMenu
                      trigger="hover"
                      align="top"
                      arrowClass="hidden-arrow"
                      menuClass="">
                      <div>
                        <Badge
                          showText={`${Applications.length - 4}+`}
                          className="extraTeamsIndicator"
                        />
                      </div>

                      <div className="extraTeamsPanel">
                        <PerfectScrollbar>
                          {ApplicationsArray.map(
                            ({ ApplicationID, Title, IconURL }, idx) => {
                              if (idx > 4)
                                return (
                                  <Styled.ExtraUserItem key={ApplicationID}>
                                    <Avatar userImage={IconURL} radius={25} />
                                    <Styled.ExtraUserTitle>
                                      {decodeBase64(Title)}
                                    </Styled.ExtraUserTitle>
                                  </Styled.ExtraUserItem>
                                );
                            }
                          )}
                        </PerfectScrollbar>
                      </div>
                    </PopupMenu>
                  </>
                );
            }
          ),
          col5: (
            <Button
              type="negative-o"
              key={User.MainEmailAddress}
              onClick={() => setRemovableUser(User)}
              style={{ padding: '0.25rem 1rem' }}>
              حذف از همه تیم ها
            </Button>
          ),
          col6: '',
        };
      }),
    [workspaceUsers, tablePage, isMobile]
  );

  //! Setup workspace user's table headers
  const columns = React.useMemo(
    () => [
      {
        Header: 'نام کاربر',
        accessor: 'col1',
      },
      //* remove [col2] and [col3] of the table on mobile view
      ...(!isMobile
        ? [
            {
              Header: `${RVDic.Mobile}/${RVDic.Email}`,
              accessor: 'col2',
            },
            {
              Header: 'آخرین ورود',
              accessor: 'col3',
            },
          ]
        : []),
      {
        Header: 'تیم های عضو',
        accessor: 'col4',
      },
      {
        Header: '',
        accessor: 'col5',
      },
    ],
    [isMobile]
  );

  //! handling the removal of the selected user from workspace
  const removeUserFromWorkspace = () => {
    const { UserID } = removableUser;
    removeUserFromWorkspaceAPI.fetch(
      { UserID, WorkspaceID },
      ({ ErrorText, Succeed }) => {
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
      }
    );
  };

  return (
    <WelcomeLayout>
      <div>
        <DeleteConfirmModal
          cancelText={RVDic.Return}
          confirmText={RVDic.Confirm}
          messageIcon={() => (
            <Avatar
              imageClasses="teamAvatar"
              userImage={removableUser.ImageURL}
            />
          )}
          show={!!removableUser}
          onConfirm={removeUserFromWorkspace}
          onCancel={() => setRemovableUser(false)}
          onClose={() => setRemovableUser(false)}
          messageQuestion="آیا از حذف کاربر از همه تیم‌ها اطمینان دارید؟"
          messageWarning="با حذف کاربر اطلاعات تولید شده توسط او از بین نمی‌رود، همچنین با افزودن دوباره کاربر به تیم، او میتواند به اطلاعات قبلی دسترسی داشته باشد."
          title="حذف از همه تیم‌ها"
          messageTitle={decodeBase64(removableUser.FullName)}
        />

        <Styled.WorkspaceSettingsHeaderContainer>
          <Breadcrumb className="breadcrumb" items={breadCrumbItems} />
          <Heading type="h1" className="pageTitle">
            {RVDic.ManageN.replace('[n]', RVDic.Users)}
          </Heading>
        </Styled.WorkspaceSettingsHeaderContainer>
        <SearchInput
          placeholder={RVDic.Search}
          onChange={setSearchText}
          delayTime={650}
          defaultValue={''}
        />

        <Styled.WorkspaceUserManagementTableContainer>
          <InfiniteScroll
            key={InfiniteScrollRerenderer}
            dataLength={workspaceUsers.length}
            next={getWorkspaceUsers}
            hasMore={typeof tablePage !== 'boolean'}
            loader={
              isLoading && (
                <LoadingIconCircle
                  style={{
                    marginInline: 'auto',
                    marginBlock: '1rem',
                    display: 'block',
                  }}
                />
              )
            }>
            <ResponsiveTable data={data} columns={columns} />
          </InfiniteScroll>
        </Styled.WorkspaceUserManagementTableContainer>
      </div>
    </WelcomeLayout>
  );
};

export default WorkspaceSettingsView;