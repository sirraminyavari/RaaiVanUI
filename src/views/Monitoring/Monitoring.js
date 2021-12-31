// import { getApplicationsMonitoring } from 'store/actions/monitoring/MonitoringActions';
import { GetApplicationsMonitoring } from 'apiHelper/apiFunctions';
import { MyTable } from 'components/CustomTable/MyTable/Mytable';
import Heading from 'components/Heading/Heading';
import OfficeIcons from 'components/Icons/OfficeIcons/OfficeIcons';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { searchContext } from 'views/Search/SearchView';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Button from '../../components/Buttons/Button';
import TextButton from '../../components/Buttons/TextButton';
import RfreshIcon from '../../components/Icons/RefreshIcon/RefreshIcon';
import { USER_PATH, USER_SECURITY_PATH } from '../../constant/constants';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import { COLUMNS } from './columns';
import * as Styled from './monitoring.styles';
import { useAppMonitoring } from './useMonitoring';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import {
  API_Provider,
  decodeBase64,
  encodeBase64,
  // getCaptchaToken,
} from 'helpers/helpers';
// import { isEmpty, isUndefined } from 'underscore';

const MonitoringView = ({ ...props }) => {
  const dispatch = useDispatch();
  // const [monitorindData, setMonitoringData] = useState({});
  const { data: monitoring, isLoading } = useAppMonitoring();
  const columns = useMemo(() => COLUMNS, []);
  // const datas = useMemo(() => MOCK_DATA, []);

  console.log(monitoring);
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
    console.log('monitoring', monitoring);
    let fieldOfExpertise = [];
    let i = monitoring.Applications;
    for (let dataObj of i) {
      console.log('mmmmmmmmm', dataObj);
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
        console.log(fieldOfExpertise);
      }
      if (dataObj.Title) {
        dataObj.Title = decodeBase64(dataObj.Title);
        console.log('dataObj.Title', dataObj.Title);
      }
      // if(dataObj.IconURL){
      //   dataObj.IconURL =  <img src='http://cliqmind-dev.ir/Images/CliqMind-Mini.png' />
      //   // 'http://cliqmind-dev.ir/../../Images/CliqMind-Mini.png'
      // }
    }
    usersMarkup = (
      <PerfectScrollbar dataLength={3} className="extra-users-scrollbar">
        <MyTable columns={columns} data={monitoring.Applications} />
      </PerfectScrollbar>
    );
  }

  const { getExcelFile } = useContext(searchContext);
  const breadcrumbItems = [
    { id: 1, title: 'پنل مدیریت', linkTo: USER_PATH },
    {
      id: 2,
      title: 'گزارشات',
      linkTo: USER_SECURITY_PATH,
    },
    {
      id: 2,
      title: 'گزارش تیم ها',
      linkTo: USER_SECURITY_PATH,
    },
  ];

  const InputContainer = styled.div`
    position: relative;
    width: 100%;
  `;

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
              <div
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
                    paddingLeft: '.8rem',
                  }}>
                  تعداد کل کاربران{' '}
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
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <label
                  className="rv-dark-gray"
                  style={{
                    // color: 'darkgray',
                    fontSize: '.66rem',
                    fontWeight: 'lighter',
                    paddingLeft: '.8rem',
                  }}>
                  تعداد کل تیم ها{' '}
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
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <AnimatedInput
          name="search"
          label="search"
          style={{ maxWidth: '480px' }}
        />
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
              padding: '.5rem',
              borderRadius: '.5rem',
              display: 'flex',
              alignItems: 'center',
            }}>
            {' '}
            <RfreshIcon size={16} />
            <span style={{ fontSize: '.7rem', paddingRight: '.2rem' }}>
              به روز رسانی لیست{' '}
            </span>
          </Button>
        </div>
      </div>
      {usersMarkup}
    </Styled.Container>
  );
};

export default MonitoringView;
