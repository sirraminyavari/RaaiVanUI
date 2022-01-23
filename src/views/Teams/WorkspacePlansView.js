import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import WelcomeLayout from 'layouts/WelcomeLayout';
import Heading from 'components/Heading/Heading';
import useWindow from 'hooks/useWindowContext';
import React, { useEffect, useState } from 'react';
import APIHandler from 'apiHelper/APIHandler';
import { useParams } from 'react-router-dom';
import { decodeBase64, encodeBase64, randomNumber } from 'helpers/helpers';
import Avatar from 'components/Avatar/Avatar';
import { useDispatch } from 'react-redux';
import { themeSlice } from 'store/reducers/themeReducer';
import { MAIN_CONTENT, SETT_WORKSPACE_CONTENT } from 'constant/constants';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import ResponsiveTable from './items/others/table/ResponsiveTable';
import {
  WorkspaceSettingsHeaderContainer,
  WorkspacePlansTableContainer,
  WorkspacePlansContainer,
} from './Teams.styles';
import {
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiInformationLine,
} from 'react-icons/ri';
import Button from 'components/Buttons/Button';
import UserIcon from 'components/Icons/UserIcon/User';
import UsersIcon from 'components/Icons/UsersIcon/Users';
import { AiOutlineLeftCircle } from 'react-icons/ai';
const { setSidebarContent } = themeSlice.actions;

const WorkspacePlansView = () => {
  const { id: WorkspaceID } = useParams();
  const dispatch = useDispatch();
  const { RVDic } = useWindow();

  const breadCrumbItems = [
    {
      id: 1,
      title: RVDic.SettingsOfN.replace('[n]', RVDic.Workspace),
      linkTo: '/workspaces',
    },
    {
      id: 2,
      title: 'طرحها',
    },
  ];

  //! configure sidebar content
  useEffect(() => {
    dispatch(
      setSidebarContent({
        current: SETT_WORKSPACE_CONTENT,
        prev: MAIN_CONTENT,
      })
    );
    return () => {
      dispatch(
        setSidebarContent({
          prev: SETT_WORKSPACE_CONTENT,
          current: MAIN_CONTENT,
        })
      );
    };
  }, []);

  //! Build a template for every row of workspace users (react-table)
  const data = React.useMemo(
    () => [
      {
        col1: (
          <>
            فضای قابل آپلود
            <RiInformationLine className="info" />
          </>
        ),
        col2: '15 گیگ',
        col3: '50 گیگ',
        col4: 'نامحدود',
      },
      {
        col1: (
          <>
            امکان ایجاد دسترسی کاربر معتمد
            <RiInformationLine className="info" />
          </>
        ),
        col2: <RiCloseCircleLine className="disabled" />,
        col3: <RiCloseCircleLine className="disabled" />,
        col4: <RiCheckboxCircleLine className="enabled" />,
      },
      {
        col1: (
          <>
            امکان ایجاد دسترسی کاربر معتمد
            <RiInformationLine className="info" />
          </>
        ),
        col2: <RiCloseCircleLine className="disabled" />,
        col3: <RiCloseCircleLine className="disabled" />,
        col4: <RiCheckboxCircleLine className="enabled" />,
      },
      {
        col1: (
          <>
            امکان ایجاد دسترسی کاربر معتمد
            <RiInformationLine className="info" />
          </>
        ),
        col2: <RiCloseCircleLine className="disabled" />,
        col3: <RiCloseCircleLine className="disabled" />,
        col4: <RiCheckboxCircleLine className="enabled" />,
      },
      {
        col1: (
          <>
            امکان ایجاد دسترسی کاربر معتمد
            <RiInformationLine className="info" />
          </>
        ),
        col2: <RiCloseCircleLine className="disabled" />,
        col3: <RiCloseCircleLine className="disabled" />,
        col4: <RiCheckboxCircleLine className="enabled" />,
      },
    ],
    []
  );

  //! Setup workspace user's table headers
  const columns = React.useMemo(
    () => [
      {
        Header: 'امکانات',
        accessor: 'col1',
      },
      {
        Header: `پایه`,
        accessor: 'col2',
      },
      {
        Header: 'حرفه‌ای',
        accessor: 'col3',
      },
      {
        Header: 'سازمانی',
        accessor: 'col4',
      },
    ],
    []
  );

  return (
    <WelcomeLayout>
      <div>
        <WorkspaceSettingsHeaderContainer>
          <Breadcrumb className="breadcrumb" items={breadCrumbItems} />
          <Heading type="h1" className="pageTitle">
            {'طرحها'}
          </Heading>
        </WorkspaceSettingsHeaderContainer>

        <WorkspacePlansContainer>
          {new Array(3).fill(undefined).map(() => {
            return (
              <div className="planItem">
                <div className="planContent rv-border-black rv-border-radius-half">
                  <div className="planImage rv-border-black rv-border-radius-half">
                    <UsersIcon />
                  </div>

                  <div className="planSlogan">برای هر کاربر در ماه</div>
                  <div className="planTitle">حرفه ای</div>
                  <div className="planSlogan">
                    مناسب کسب‌وکارهای کوچک و متوسط
                  </div>
                  {new Array(3).fill(undefined).map(() => {
                    return (
                      <div className="planDescription">
                        <AiOutlineLeftCircle />
                        ده گیگابایت فضای ذخیره‌سازی
                      </div>
                    );
                  })}
                  <div className="planActionButton">
                    <Button type="primary">انتحاب طرح</Button>
                  </div>
                </div>
              </div>
            );
          })}
        </WorkspacePlansContainer>

        <Button
          style={{ display: 'inline-block' }}
          $circleEdges
          type="primary-o">
          مشاهده امکانات کامل
        </Button>
        <Heading
          type="h3"
          style={{ textAlign: 'center', marginBlockStart: '10rem' }}>
          مقایسه امکانات طرح‌های کلیک‌مایند
        </Heading>
        <WorkspacePlansTableContainer>
          <ResponsiveTable data={data} columns={columns} />
        </WorkspacePlansTableContainer>
      </div>
    </WelcomeLayout>
  );
};

export default WorkspacePlansView;
