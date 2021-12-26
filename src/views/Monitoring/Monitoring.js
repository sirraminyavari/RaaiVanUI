import { MyTable } from 'components/CustomTable/MyTable/Mytable';
import Heading from 'components/Heading/Heading';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import { useMemo, useContext } from 'react';
import styled from 'styled-components';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Button from '../../components/Buttons/Button';
import TextButton from '../../components/Buttons/TextButton';
import RfreshIcon from '../../components/Icons/RefreshIcon/RefreshIcon';
import { USER_PATH, USER_SECURITY_PATH } from '../../constant/constants';
import { searchContext } from 'views/Search/SearchView';
import MOCK_DATA from '../../mockdata/MOCK_DATA.json';
import { COLUMNS } from './columns';
import OfficeIcons from 'components/Icons/OfficeIcons/OfficeIcons';
import * as Styled from './monitoring.styles';

const MonitoringView = ({ ...props }) => {
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
  const columns = useMemo(() => COLUMNS, []);
  const datas = useMemo(() => MOCK_DATA, []);
  const data = [
    { id: 1, name: 'تیم محصول کلیک مایند' },
    { id: 2, date: '1400/12/12' },
  ];
  // const columns = ['col1', 'col2'];
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
      <MyTable columns={columns} data={datas} />{' '}
    </Styled.Container>
  );
};

export default MonitoringView;
