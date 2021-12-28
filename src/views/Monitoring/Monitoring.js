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
import MOCK_DATA from '../../mockdata/MOCK_DATA.json';
import { COLUMNS } from './columns';
import * as Styled from './monitoring.styles';
import { useAppMonitoring } from './useMonitoring';
// import { getApplications } from 'store/actions/applications/ApplicationsAction';

// import { isEmpty, isUndefined } from 'underscore';

const MonitoringView = ({ ...props }) => {
  const dispatch = useDispatch();
  const [monitorindData, setMonitoringData] = useState({});
  const { data: monitoring, isLoading } = useAppMonitoring();
  const columns = useMemo(() => COLUMNS, []);
  const datas = useMemo(() => MOCK_DATA, []);
  // const [monitoringApp, setMonitoringApp] = useState([]);
  // const monitoring = useSelector((state) => console.log(state));
  console.log(monitoring);
  let usersMarkup;
  if (isLoading) {
    usersMarkup = <div>Loading...</div>;
  } else if (monitoring && monitoring.Applications.length === 0) {
    usersMarkup = <div>No Team!</div>;
  } else if (monitoring && monitoring.Applications.length >= 0) {
    console.log('monitoring', monitoring);
    let fieldOfExpertise = [];
    let i = monitoring.Applications;
    for (let dataObj of i) {
      if (dataObj.FieldOfExpertise) {
        console.log('dataObj.FieldOfExpertise', dataObj.FieldOfExpertise);
        dataObj.FieldOfExpertise = dataObj.FieldOfExpertise;
        dataObj.FieldOfExpertise.Name = fieldOfExpertise.push(
          dataObj.FieldOfExpertise.Name
        );
        console.log(fieldOfExpertise);
      }
      // dataObj.FieldOfExpertise = dataObj.FieldOfExpertise.Name;
      // dataObj.FieldOfExpertise = dataObjFieldOfExpertise;
    }
    usersMarkup = <MyTable columns={columns} data={monitoring.Applications} />;
  }

  // useEffect(() => {
  //   GetApplicationsMonitoring({}).then((res) => {
  //     console.log('res', res);
  //     // setMonitoringData(res)
  //     // console.log('monitorindData', monitorindData);
  //     // setMonitoringApp(res.Applications)
  //     // console.log('monitoringApp',monitoringApp);
  //   });
  // }, []);

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
                <label style={{ fontWeight: 'bold' }}>126</label>
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
                <label style={{ fontWeight: 'bold' }}>37</label>
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
      {/* <MyTable columns={columns} data={monitoring.Applications} />{' '} */}
      {usersMarkup}
    </Styled.Container>
  );
};

export default MonitoringView;
