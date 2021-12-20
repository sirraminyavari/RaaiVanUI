import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { useEffect, useState } from 'react';
import * as Styled from './monitoring.styles';
import { USER_PATH, USER_SECURITY_PATH } from '../../constant/constants';
import useWindow from 'hooks/useWindowContext';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Heading from 'components/Heading/Heading';
import APIHandler from '../../apiHelper/APIHandler';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import CustomTable from '../../components/CustomTable/CustomTable';
import Button from '../../components/Buttons/Button';
// import LoadingButton from '../../components/Buttons/LoadingButton';
import TextButton from '../../components/Buttons/TextButton';

const MonitoringView = ({ ...props }) => {
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

  const data = [
    { id: 1, name: 'a' },
    { id: 2, name: 'b' },
  ];
  const columns = ['col1', 'col2'];
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
                border: '1px solid darkgray',
                padding: '.9rem',
                margin: '0.5rem .5rem',
                width: '130px',
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label
                  className=""
                  style={{
                    color: 'darkgray',
                    fontSize: '12px',
                    fontWeight: 'lighter',
                  }}>
                  تعداد کل کاربران{' '}
                </label>
                <label style={{ fontWeight: 'bold' }}>126</label>
              </div>
            </TextButton>
            <TextButton
              className="primary"
              style={{
                border: '1px solid darkgray',
                padding: '.9rem',
                margin: '0.5rem 0rem',
                width: '130px',
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label
                  className=""
                  style={{
                    color: 'darkgray',
                    fontSize: '12px',
                    fontWeight: 'lighter',
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
        <Button
          className=""
          style={{
            color: '#2B7BE4',
            border: '1px solid #2B7BE4',
            padding: '.5rem .5rem',
            borderRadius: '8px',
            fontSize: '12px',
          }}>
          {' '}
          به روز رسانی لیست{' '}
        </Button>
      </div>
      {/* <CustomTable data={data} columns={columns}/> */}
    </Styled.Container>
  );
};

export default MonitoringView;
