// import { getApplicationsMonitoring } from 'store/actions/monitoring/MonitoringActions';
import { GetApplicationsMonitoring } from 'apiHelper/apiFunctions';
import { Space } from 'components';
import { MyTable } from 'components/CustomTable/MyTable/Mytable';
import Heading from 'components/Heading/Heading';
import LoadingIconFlat from 'components/Icons/LoadingIcons/LoadingIconFlat';
import OfficeIcons from 'components/Icons/OfficeIcons/OfficeIcons';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import { decodeBase64, getURL } from 'helpers/helpers';
import useWindowContext from 'hooks/useWindowContext';
import { useContext, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch } from 'react-redux';
import { searchContext } from 'views/Search/SearchView';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Button from '../../components/Buttons/Button';
import TextButton from '../../components/Buttons/TextButton';
import RfreshIcon from '../../components/Icons/RefreshIcon/RefreshIcon';
import {
  REPORTS_PATH,
  USER_PATH,
  USER_SECURITY_PATH,
} from '../../constant/constants';
import { COLUMNS } from './columns';
import * as Styled from './monitoring.styles';
import { useAppMonitoring } from './useMonitoring';
import {
  Route,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router-dom';
import { MONITORING_TEAMS_PATH } from 'constant/constants';
import Teams from './MonitoringTeams/Teams';

const MonitoringView = ({ ...props }) => {
  const dispatch = useDispatch();
  const params = useParams();
  const { path, url } = useRouteMatch();
  console.log(path);
  console.log(url);
  console.log(params.ApplicationID);
  const history = useHistory();
  const location = useLocation();
  const { pathname } = location;
  const { RV_RTL, RVDic } = useWindowContext();
  const { data: monitoring, isLoading, hasMore } = useAppMonitoring();
  const [count, setCount] = useState(8);
  const [lowerBoundary, setLowerBoundary] = useState(5);
  console.log('RV_RTL', RV_RTL);
  let name = [];
  const handleRowClick = (template, index) => {
    console.log(
      template,
      pathname + '/' + monitoring.Applications[0].ApplicationID
    );
    // console.log(`${path}/:ApplicationID`);
    console.log(`${url}/:ApplicationID`);
    // console.log(`/monitoring/${index}`);
    history.push(`${url}/:ApplicationID`);
    // history.push(`${url}/`+monitoring.Applications[0].ApplicationID);
  };
  const loadMore = () => {
    if (lowerBoundary <= monitoring.Applications.length + count) {
      // setPage((prv) => prv + 5);
      GetApplicationsMonitoring({ count: 8, lowerBoundary });
    }
    setLowerBoundary((prv) => prv + 8);
  };
  const columns = useMemo(() => COLUMNS, []);
  // const datas = useMemo(() => MOCK_DATA, []);
  console.log(hasMore, 'hasMore');
  console.log(isLoading, 'isLoading');
  let usersMarkup;
  if (isLoading) {
    usersMarkup = (
      <div>
        <LogoLoader />
      </div>
    );
  } else if (monitoring && monitoring.Applications.length === 0) {
    usersMarkup = <div>No Team!</div>;
  } else if (monitoring && monitoring.Applications.length >= 0) {
    let fieldOfExpertise = [];
    let title = [];
    let i = monitoring.Applications;
    for (let dataObj of i) {
      if (dataObj.FieldOfExpertise) {
        dataObj.FieldOfExpertise = dataObj.FieldOfExpertise;
        console.log(
          'dataObj.LastActivityTime',
          dataObj.LastActivityTime.slice(10, 15)
        );
        dataObj.LastActivityTime = dataObj.LastActivityTime.slice(10, 15);
        dataObj.FieldOfExpertise.Name = fieldOfExpertise.push(
          dataObj.FieldOfExpertise.Name
        );
      }
      if (dataObj.Title) {
        dataObj.Title = decodeBase64(dataObj.Title);
        // setName((dataObj.Title));
        title.push(dataObj.Title);
      }
      if (dataObj.ApplicationID) {
        name = dataObj.ApplicationID;
        console.log(dataObj.ApplicationID);
      }
    }

    console.log(title);
    console.log(pathname + `/${name}`);

    usersMarkup = (
      <InfiniteScroll
        dataLength={monitoring.TotalApplicationsCount}
        next={loadMore}
        hasMore={hasMore ? true : false}
        scrollableTarget="scrollableDiv"
        onScroll={() =>
          setTimeout(() => {
            loadMore();
          }, 1000)
        }
        loader={
          hasMore && (
            <div style={{ textAlign: 'center' }}>
              <LoadingIconFlat />
            </div>
          )
        }
        endMessage={
          !hasMore && (
            <div style={{ textAlign: 'center' }}> No More data... </div>
          )
        }>
        <MyTable
          columns={columns}
          data={monitoring.Applications.slice(0, lowerBoundary)}
        />
        {/* {hasMore ? 'Loading...' : 'Load More'} */}
      </InfiniteScroll>
    );
  }

  const { getExcelFile } = useContext(searchContext);
  const breadcrumbItems = [
    { id: 1, title: RVDic?.AdminPanel, linkTo: USER_PATH },
    {
      id: 2,
      title: RVDic?.Reports,
      linkTo: REPORTS_PATH,
    },
    {
      id: 2,
      title: RVDic?.TeamsReport,
      linkTo: REPORTS_PATH,
    },
  ];

  return (
    <Styled.Container>
      <Breadcrumb items={breadcrumbItems} />
      <Styled.Title>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Heading className="" type={'h1'}>
            {RVDic?.Teams}
          </Heading>

          <div style={{ display: 'flex' }}>
            <TextButton
              className="primary"
              style={{
                border: '1px solid var(--rv-gray-color-dark)',
                margin: '0.5rem .5rem',
                width: '130px',
              }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  // marginInlineEnd: '30px'
                }}>
                <label
                  className="rv-dark-gray"
                  style={{
                    // color: 'darkgray',
                    fontSize: '.66rem',
                    fontWeight: 'lighter',
                    marginInlineEnd: '.8rem',
                  }}>
                  {RVDic.TotalNCount.replace('[n]', RVDic.Users)}
                </label>
                <label style={{ fontWeight: 'bold' }}>
                  {monitoring && monitoring.TotalApplicationsCount
                    ? monitoring.TotalApplicationsCount
                    : ''}
                </label>
              </div>
            </TextButton>
            <TextButton
              className="primary"
              style={{
                border: '1px solid var(--rv-gray-color-dark)',
                padding: '.7rem',
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
                    fontSize: '.66rem',
                    fontWeight: 'lighter',
                    marginInlineEnd: '.8rem',
                  }}>
                  {RVDic.TotalNCount.replace('[n]', RVDic.Teams)}
                </label>
                <label style={{ fontWeight: 'bold' }}>
                  {monitoring && monitoring.TotalUsersCount
                    ? monitoring.TotalUsersCount
                    : ''}
                </label>
              </div>
            </TextButton>
          </div>
        </div>
      </Styled.Title>
      <Styled.Grid>
        <Styled.Inpt>
          <AnimatedInput name="search" placeholder={RVDic?.Search} />
        </Styled.Inpt>
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
            <div
              space=".3rem"
              style={{
                display: 'flex',
                // justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginInlineEnd: '.3rem',
                }}>
                <RfreshIcon size={17} />
              </span>
              <span
                style={{
                  fontSize: '.7rem',
                  alignItems: 'center',
                }}>
                {RVDic?.Update}
              </span>
            </div>
          </Button>
        </div>
      </Styled.Grid>

      {usersMarkup}
      {/* {showMore && <button onClick={loadMore}> Load More </button>} */}
      <Route path={`${path}/:ApplicationID`}>
        <Teams />
      </Route>
      {/* <Route exact path={`monitoring/:ApplicationID`}><Teams /></Route> */}
    </Styled.Container>
  );
};

export default MonitoringView;
