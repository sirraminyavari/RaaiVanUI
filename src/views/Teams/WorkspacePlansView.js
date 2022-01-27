import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import WelcomeLayout from 'layouts/WelcomeLayout';
import Heading from 'components/Heading/Heading';
import useWindow from 'hooks/useWindowContext';
import React, { useState } from 'react';
import APIHandler from 'apiHelper/APIHandler';
import { useParams } from 'react-router-dom';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import ResponsiveTable from './items/others/table/ResponsiveTable';
import * as Styled from './Teams.styles';
import {
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiInformationLine,
} from 'react-icons/ri';
import Button from 'components/Buttons/Button';
import Tooltip from 'components/Tooltip/react-tooltip/Tooltip';
import ToggleButton from 'components/Buttons/Toggle/Toggle';
import { scrollIntoView } from 'helpers/helpers';
import WorkspacePlanItem from './items/sides/content/WorkspacePlanItem';

const WorkspacePlansView = () => {
  const { id: WorkspaceID } = useParams();
  const [isYearlyPrices, setIsYearlyPrices] = useState(false);
  const { RVDic } = useWindow();
  const { isTabletOrMobile } = DimensionHelper();

  const breadCrumbItems = [
    {
      id: 1,
      title: RVDic.SettingsOfN.replace('[n]', RVDic.Workspace),
      linkTo: '/workspaces',
    },
    {
      id: 2,
      title: 'طرحها',
      linkTo: '/workspaces',
    },
  ];

  //! Build a template for every row of workspace plan descriptions (react-table)
  const data = React.useMemo(
    () => [
      {
        col1: (
          <>
            فضای قابل آپلود
            <Tooltip
              effect="solid"
              place="top"
              renderContent={() => 'لورم ایپسوم'}>
              <RiInformationLine className="info" />
            </Tooltip>
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
            <Tooltip
              effect="solid"
              place="top"
              renderContent={() => 'لورم ایپسوم'}>
              <RiInformationLine className="info" />
            </Tooltip>
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
    <WelcomeLayout noOutline>
      <div>
        <Styled.WorkspacePlansHeaderContainer>
          <Breadcrumb className="breadcrumb" items={breadCrumbItems} />
          <Heading type="h1" className="pageTitle">
            {'طرحها'}
          </Heading>
          <div className="paymentType">
            <span className={isYearlyPrices && `active`}>پرداخت سالیانه</span>
            <ToggleButton onToggle={setIsYearlyPrices} value={isYearlyPrices} />
            <span className={!isYearlyPrices && `active`}>پرداخت ماهیانه</span>
          </div>
        </Styled.WorkspacePlansHeaderContainer>

        <Styled.WorkspacePlansContainer wrapContent={isTabletOrMobile}>
          {new Array(3).fill(undefined).map(() => {
            return <WorkspacePlanItem isYearlyPrices={isYearlyPrices} />;
          })}
        </Styled.WorkspacePlansContainer>
        <Styled.WorkspacePlansActionContainer>
          <Button
            $circleEdges
            style={{
              paddingInline: '3rem',
              marginBlockStart: '1rem',
            }}
            onClick={() => scrollIntoView('planDetails')}
            type="primary-o">
            مشاهده امکانات کامل
          </Button>
        </Styled.WorkspacePlansActionContainer>

        <Heading
          id="planDetails"
          type="h3"
          style={{ textAlign: 'center', marginBlockStart: '8rem' }}>
          مقایسه امکانات طرح‌های کلیک‌مایند
        </Heading>
        <Styled.WorkspacePlansTableContainer>
          <ResponsiveTable data={data} columns={columns} />
        </Styled.WorkspacePlansTableContainer>
      </div>
    </WelcomeLayout>
  );
};

export default WorkspacePlansView;
