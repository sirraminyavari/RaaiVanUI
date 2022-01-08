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
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Button from '../../components/Buttons/Button';
import TextButton from '../../components/Buttons/TextButton';
import RfreshIcon from '../../components/Icons/RefreshIcon/RefreshIcon';
import { USER_PATH, USER_SECURITY_PATH } from '../../constant/constants';
import { COLUMNS } from './columns';
import * as Styled from './monitoring.styles';
import { useAppMonitoring } from './useMonitoring';

const MonitoringView = ({ ...props }) => {
  const dispatch = useDispatch();
  const { RV_RTL, RVDic } = useWindowContext();
  const { data: monitoring, isLoading, hasMore } = useAppMonitoring();
  const [count, setCount] = useState(8);
  const [lowerBoundary, setLowerBoundary] = useState(5);
  console.log('RV_RTL', RV_RTL);
  const loadMore = () => {
    // setLowerBoundary(prv=> prv + 20);
    // for (let i = 1; i <= Math.ceil(monitoring.TotalApplicationsCount / count); i++) {}
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
    let i = monitoring.Applications;
    for (let dataObj of i) {
      // console.log('mmmmmmmmm', dataObj);
      if (dataObj.FieldOfExpertise) {
        console.log('dataObj.FieldOfExpertise', dataObj.FieldOfExpertise);
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
      }
    }
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
        }
        // ref={lastItem}
      >
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
      linkTo: USER_SECURITY_PATH,
    },
    {
      id: 2,
      title: RVDic?.TeamsReport,
      linkTo: USER_SECURITY_PATH,
    },
  ];

  return (
    <Styled.Container>
      <Breadcrumb items={breadcrumbItems} />

      <Styled.Title>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Heading className="" type={'h1'}>
            {'تیم ها '}
          </Heading>

          <div style={{ display: 'flex' }}>
            <TextButton
              className="primary"
              style={{
                border: '1px solid var(--rv-gray-color-dark)',
                margin: '0.5rem .5rem',
                width: '130px',
              }}>
              <Space
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <label
                  className="rv-dark-gray"
                  style={{
                    // color: 'darkgray',
                    fontSize: '.66rem',
                    fontWeight: 'lighter',
                    // paddingLeft: '.8rem',
                  }}>
                  تعداد کل کاربران{' '}
                </label>
                <label style={{ fontWeight: 'bold' }}>
                  {monitoring && monitoring.TotalApplicationsCount
                    ? monitoring.TotalApplicationsCount
                    : ''}
                </label>
              </Space>
            </TextButton>
            <TextButton
              className="primary"
              style={{
                border: '1px solid var(--rv-gray-color-dark)',
                padding: '.7rem',
                margin: '0.5rem 0rem',
                width: '130px',
              }}>
              <Space
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  justifyContent: 'space-between',
                }}>
                <label
                  className="rv-dark-gray"
                  style={{
                    // color: 'darkgray',
                    fontSize: '.66rem',
                    fontWeight: 'lighter',
                    // paddingLeft: '.8rem',
                  }}>
                  تعداد کل تیم ها{' '}
                </label>
                <label style={{ fontWeight: 'bold' }}>
                  {monitoring && monitoring.TotalUsersCount
                    ? monitoring.TotalUsersCount
                    : ''}
                </label>
              </Space>
            </TextButton>
          </div>
        </div>
      </Styled.Title>
      <Styled.Grid>
        <Styled.Inpt>
          <AnimatedInput
            name="search"
            label="search"
            // style={{ maxWidth: '480px' }}
          />
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
      {usersMarkup}
      {/* {showMore && <button onClick={loadMore}> Load More </button>} */}
    </Styled.Container>
  );
};

export default MonitoringView;
