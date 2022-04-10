import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import Heading from 'components/Heading/Heading';
import Button from 'components/Buttons/Button';
import InfoCircleIcon from 'components/Icons/InfoCircleIcon/InfoIcon';
import CheckCircleIcon from 'components/Icons/CheckCircle';
import CancelCircleIcon from 'components/Icons/CancelCircle';
import Tooltip from 'components/Tooltip/react-tooltip/Tooltip';
import ToggleButton from 'components/Buttons/Toggle/Toggle';
import useWindow from 'hooks/useWindowContext';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import { scrollIntoView } from 'helpers/helpers';
import {
  WORKSPACES_PATH,
  WORKSPACE_PLANS_PATH,
} from './../../others/constants';
import ResponsiveTable from './../../others/table/ResponsiveTable';
import * as Styled from './../../../Teams.styles';
import WorkspacePlanItem from './WorkspacePlanItem';

const WorkspacePlansContent = ({ WorkspaceID }) => {
  const { RVDic } = useWindow();
  const { isTabletOrMobile } = DimensionHelper();

  const [isYearlyPrices, setIsYearlyPrices] = useState(false);

  //! RVDic i18n variables
  const RVDicWorkspaceSettings = RVDic.SettingsOfN.replace(
    '[n]',
    RVDic.Workspace
  );
  const RVDicWorkspacePlans = RVDic.Plans;
  const RVDicAnnualPayment = RVDic.AnnualPayment;
  const RVDicMonthlyPayment = RVDic.MonthlyPayment;
  const RVDicComparePlans = RVDic.ComparePlans;

  const breadCrumbItems = [
    {
      id: 1,
      title: RVDicWorkspaceSettings,
      linkTo: WORKSPACES_PATH,
    },
    {
      id: 2,
      title: RVDicWorkspacePlans,
      linkTo: `${WORKSPACE_PLANS_PATH}/${WorkspaceID}`,
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
              renderContent={() => 'لورم ایپسوم'}
            >
              <InfoCircleIcon className="info" />
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
              renderContent={() => 'لورم ایپسوم'}
            >
              <InfoCircleIcon className="info" />
            </Tooltip>
          </>
        ),
        col2: <CancelCircleIcon outline className="disabled" />,
        col3: <CancelCircleIcon outline className="disabled" />,
        col4: <CheckCircleIcon outline className="enabled" />,
      },
      {
        col1: (
          <>
            امکان ایجاد دسترسی کاربر معتمد
            <InfoCircleIcon className="info" />
          </>
        ),
        col2: <CancelCircleIcon outline className="disabled" />,
        col3: <CancelCircleIcon outline className="disabled" />,
        col4: <CheckCircleIcon outline className="enabled" />,
      },
      {
        col1: (
          <>
            امکان ایجاد دسترسی کاربر معتمد
            <InfoCircleIcon className="info" />
          </>
        ),
        col2: <CancelCircleIcon outline className="disabled" />,
        col3: <CancelCircleIcon outline className="disabled" />,
        col4: <CheckCircleIcon outline className="enabled" />,
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
    <>
      <div>
        <Styled.WorkspacePlansHeaderContainer>
          <Breadcrumb className="breadcrumb" items={breadCrumbItems} />
          <Heading type="h1" className="pageTitle">
            {RVDicWorkspacePlans}
          </Heading>
          <div className="paymentType">
            <span className={isYearlyPrices && `active`}>
              {RVDicAnnualPayment}
            </span>
            <ToggleButton onToggle={setIsYearlyPrices} value={isYearlyPrices} />
            <span className={!isYearlyPrices && `active`}>
              {RVDicMonthlyPayment}
            </span>
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
            type="primary-o"
          >
            {RVDicComparePlans}
          </Button>
        </Styled.WorkspacePlansActionContainer>

        <Heading
          id="planDetails"
          type="h3"
          style={{ textAlign: 'center', marginBlockStart: '8rem' }}
        >
          {RVDicComparePlans}
        </Heading>
        <Styled.WorkspacePlansTableContainer>
          <ResponsiveTable data={data} columns={columns} />
        </Styled.WorkspacePlansTableContainer>
      </div>
    </>
  );
};
WorkspacePlansContent.propTypes = {
  WorkspaceID: PropTypes.string.isRequired,
};

WorkspacePlansContent.displayName = 'WorkspacePlansContent';
export default WorkspacePlansContent;
