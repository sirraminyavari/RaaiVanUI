// import { getApplicationsMonitoring } from 'store/actions/monitoring/MonitoringActions';
import { GetApplicationsMonitoring } from 'apiHelper/apiFunctions';
import { Space } from 'components';
import { MyTable } from 'components/CustomTable/MyTable/Mytable';
import Heading from 'components/Heading/Heading';
import LoadingIconFlat from 'components/Icons/LoadingIcons/LoadingIconFlat';
import OfficeIcons from 'components/Icons/OfficeIcons/OfficeIcons';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import { decodeBase64 } from 'helpers/helpers';
import useWindowContext from 'hooks/useWindowContext';
import { useContext, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch } from 'react-redux';
import { searchContext } from 'views/Search/SearchView';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import Button from 'components/Buttons/Button';
import TextButton from 'components/Buttons/TextButton';
import RfreshIcon from 'components/Icons/RefreshIcon/RefreshIcon';
import { USER_PATH, USER_SECURITY_PATH } from 'constant/constants';
import * as Styled from '../monitoring.styles';
import { useAppMonitoring } from '../useMonitoring';
import { useLocation, useParams, useRouteMatch } from 'react-router-dom';
import { useTeamMonitoring } from './useMonitoringTeams';
import { COLUMNS } from './column';
import { Base64 } from 'js-base64';
import FilledCalendarIcon from 'components/Icons/CalendarIcon/EmptyCalendarIcon';

const Teams = ({ ...props }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { pathname } = location;
  const params = useParams();
  let { ApplicationID } = useParams();
  const { data, isLoading } = useTeamMonitoring();
  const { path, url } = useRouteMatch();
  console.log(data, 'data');
  console.log(path);
  console.log(url);
  console.log(params.ApplicationID);
  const { RV_RTL, RVDic } = useWindowContext();
  const [lowerBoundary, setLowerBoundary] = useState(5);
  const columns = useMemo(() => COLUMNS, []);
  console.log('RV_RTL', RV_RTL);

  const { getExcelFile } = useContext(searchContext);
  const breadcrumbItems = [
    { id: 1, title: RVDic?.AdminPanel, linkTo: USER_PATH },
    {
      id: 2,
      title: RVDic?.Reports,
      linkTo: USER_SECURITY_PATH,
    },
    {
      id: 3,
      title: RVDic?.TeamsReport,
      linkTo: USER_SECURITY_PATH,
    },
    {
      id: 3,
      title: data?.Application?.Title,
      // 'تیم محصول کلیک مایند',
      linkTo: USER_SECURITY_PATH,
    },
  ];

  let usersMarkup;
  if (isLoading) {
    usersMarkup = (
      <div>
        <LogoLoader />
      </div>
    );
  } else if (data && data.Users.length === 0) {
    usersMarkup = <div>No Team!</div>;
  } else if (data && data.Users.length > 0) {
    let i = data.Users;

    for (let dataObj of i) {
      console.log(decodeBase64(dataObj.FullName));
      dataObj.FullName = decodeBase64(dataObj.FullName);
      console.log(decodeBase64(dataObj.MainEmailAddress));
      dataObj.MainEmailAddress = decodeBase64(dataObj.MainEmailAddress);
    }
    usersMarkup = (
      // <InfiniteScroll
      //   dataLength={monitoring.TotalApplicationsCount}
      //   next={loadMore}
      //   hasMore={hasMore ? true : false}
      //   scrollableTarget="scrollableDiv"
      //   onScroll={() =>
      //     setTimeout(() => {
      //       loadMore();
      //     }, 1000)
      //   }
      //   loader={
      //     hasMore && (
      //       <div style={{ textAlign: 'center' }}>
      //         <LoadingIconFlat />
      //       </div>
      //     )
      //   }
      //   endMessage={
      //     !hasMore && (
      //       <div style={{ textAlign: 'center' }}> No More data... </div>
      //     )
      //   }>
      <MyTable columns={columns} data={data.Users.slice(0, lowerBoundary)} />

      //  </InfiniteScroll>
    );
  }

  return (
    <Styled.Container>
      <Breadcrumb items={breadcrumbItems} />
      <Styled.Title>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Heading className="" type={'h1'}>
            {/* {'تیم محصول کلیلک مایند'} */}
            {data && data.Application.Title}
          </Heading>
        </div>
      </Styled.Title>
      <Styled.Grid>
        <Styled.Inpt>
          <AnimatedInput name="search" placeholder={RVDic?.Search} />
        </Styled.Inpt>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Styled.ExcelContainer>
            <FilledCalendarIcon size={20} />
          </Styled.ExcelContainer>
          <Styled.ExcelContainer>
            <OfficeIcons
              type="excel"
              size={20}
              className="search-export-excel"
              onClick={getExcelFile}
            />
          </Styled.ExcelContainer>

          <Button
            className="rv-default"
            style={{
              // color: '#2B7BE4',
              border: '1px solid var(--rv-color)',
              padding: '.51rem',
              borderRadius: '.5rem',
              display: 'flex',
              alignItems: 'center',
            }}>
            {' '}
            <Space
              space=".3rem"
              style={{
                display: 'flex',
                // justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <span
                style={{
                  // fontSize: '.7rem',
                  display: 'flex',
                  // justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <RfreshIcon size={17} />
              </span>
              <span
                style={{
                  fontSize: '.7rem',
                  // display: 'flex',
                  // justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                به روز رسانی لیست{' '}
              </span>
            </Space>
          </Button>
        </div>
      </Styled.Grid>
      <Styled.Grid>
        <TextButton
          className="primary"
          style={{
            border: '1px solid var(--rv-gray-color-dark)',
            padding: '.7rem .2rem',
            margin: '0.5rem 0rem',
            width: '130px',
          }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <label
              className="rv-dark-gray"
              style={{
                // color: 'darkgray',
                fontSize: '.6rem',
                fontWeight: 'lighter',
                marginInlineEnd: '.5rem',
              }}>
              {/* اعضای تیم */}
              {RVDic?.Members}
            </label>
            <label style={{ fontWeight: 'bold' }}>
              {data && data.Application.MembersCount}
            </label>
          </div>
        </TextButton>
        <TextButton
          className="primary"
          style={{
            border: '1px solid var(--rv-gray-color-dark)',
            padding: '.7rem .2rem',
            margin: '0.5rem 0rem',
            width: '130px',
          }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              // justifyContent: 'space-between',
            }}>
            <label
              className="rv-dark-gray"
              style={{
                // color: 'darkgray',
                fontSize: '.6rem',
                fontWeight: 'lighter',
                marginInlineEnd: '.5rem',
              }}>
              آیتم های ثبت شده {RVDic?.CreatedNodes}
              {/* {data && data.Application.AttachmentSizeMB} */}
            </label>
            <label style={{ fontWeight: 'bold' }}>
              {/* {monitoring && monitoring.TotalUsersCount
                ? monitoring.TotalUsersCount
                : ''} */}
              {data && data.Application.CreatedNodesCount}
            </label>
          </div>
        </TextButton>
        <TextButton
          className="primary"
          style={{
            border: '1px solid var(--rv-gray-color-dark)',
            padding: '.7rem .2rem',

            margin: '0.5rem 0rem',
            width: '130px',
          }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <label
              className="rv-dark-gray"
              style={{
                // color: 'darkgray',
                fontSize: '.6rem',
                fontWeight: 'lighter',
                marginInlineEnd: '.5rem',
              }}>
              تمپلیت های مورد استفاده {RVDic?.UsedTemplates}
            </label>
            <label style={{ fontWeight: 'bold' }}>
              {data && data.Application.UsedTemplatesCount}
            </label>
          </div>
        </TextButton>

        <TextButton
          className="primary"
          style={{
            border: '1px solid var(--rv-gray-color-dark)',
            padding: '.7rem .2rem',

            margin: '0.5rem 0rem',
            width: '130px',
          }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              // justifyContent: 'space-between',
            }}>
            <label
              className="rv-dark-gray"
              style={{
                // color: 'darkgray',
                fontSize: '.6rem',
                fontWeight: 'lighter',
                marginInlineEnd: '.5rem',
              }}>
              بازدید آیتم های ثبت شده {RVDic?.NodeVisits}
            </label>
            <label style={{ fontWeight: 'bold' }}>
              {data && data.Application.VisitedNodesCount}
            </label>
          </div>
        </TextButton>
        <TextButton
          className="primary"
          style={{
            border: '1px solid var(--rv-gray-color-dark)',
            padding: '.7rem .2rem',

            margin: '0.5rem 0rem',
            width: '130px',
          }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              // justifyContent: 'space-between',
            }}>
            <label
              className="rv-dark-gray"
              style={{
                // color: 'darkgray',
                fontSize: '.6rem',
                fontWeight: 'lighter',
                marginInlineEnd: '.5rem',
              }}>
              حجم مورد استفاده
              {RVDic?.UsedStorage}
            </label>
            <label style={{ fontWeight: 'bold' }}>
              {data && data.Application.AttachmentSizeMB}
            </label>
          </div>
        </TextButton>
      </Styled.Grid>
      {usersMarkup}
    </Styled.Container>
  );
};

export default Teams;
