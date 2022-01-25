import { Space } from 'components';
import { MyTable } from 'components/CustomTable/MyTable/Mytable';
import Heading from 'components/Heading/Heading';
import OfficeIcons from 'components/Icons/OfficeIcons/OfficeIcons';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import { decodeBase64 } from 'helpers/helpers';
import useWindowContext from 'hooks/useWindowContext';
import { useContext, useMemo, useState } from 'react';
import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';
import { useDispatch } from 'react-redux';
import { searchContext } from 'views/Search/SearchView';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import Button from 'components/Buttons/Button';
import TextButton from 'components/Buttons/TextButton';
import RefreshIcon from 'components/Icons/RefreshIcon/RefreshIcon';
import {
  USER_PATH,
  USER_SECURITY_PATH,
  REPORTS_PATH,
  MONITORING_TEAMS_PATH,
  MONITORING_PATH,
} from 'constant/constants';
import * as Styled from '../monitoring.styles';
import {
  Link,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router-dom';
import { useTeamMonitoring } from './useMonitoringTeams';
import { COLUMNS } from './column';
import EmptyCalendarIcon from 'components/Icons/CalendarIcon/EmptyCalendarIcon';
import FilledCalendarIcon from 'components/Icons/CalendarIcon/EmptyCalendarIcon';
import { ShadowButton } from './datepicker.style';

const Teams = ({ ...props }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { pathname } = location;
  const history = useHistory();
  const params = useParams();
  let { ApplicationID } = useParams();
  const {
    data,
    isLoading,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
  } = useTeamMonitoring();
  const { path, url } = useRouteMatch();
  console.log(data, 'data');
  console.log(path);
  console.log(url);
  console.log(params.ApplicationID);
  const { RV_RTL, RVDic } = useWindowContext();
  const [lowerBoundary, setLowerBoundary] = useState(5);
  const columns = useMemo(() => COLUMNS, []);
  console.log('RV_RTL', RV_RTL);
  const [calendarPickerClicked, setCalendarPickerClicked] = useState(false);
  const [date, setDate] = useState(null);

  const [dateHover, setDateHover] = useState(false);

  const { getExcelFile } = useContext(searchContext);
  const breadcrumbItems = [
    { id: 1, title: RVDic?.AdminPanel, linkTo: USER_PATH },
    {
      id: 2,
      title: RVDic?.Reports,
      linkTo: REPORTS_PATH,
    },
    {
      id: 3,
      title: RVDic?.TeamsReport,
      linkTo: MONITORING_PATH,
    },
    {
      id: 3,
      title: data?.Application?.Title,
      linkTo: MONITORING_TEAMS_PATH,
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
      <MyTable columns={columns} data={data.Users.slice(0, lowerBoundary)} />
    );
  }

  return (
    <Styled.Container>
      <Styled.Grid>
        <div>
          <Breadcrumb items={breadcrumbItems} />
        </div>
        <div>
          {/* <Styled.ReturnBtn> */}
          <Styled.ReturnBtn as={Link} to={MONITORING_PATH}>
            بازگشت{' '}
          </Styled.ReturnBtn>
          {/* </Styled.ReturnBtn> */}
          {/* </TextButton> */}
        </div>
      </Styled.Grid>

      <Styled.Title>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Heading className="" type={'h1'}>
            {data && data.Application.Title}
          </Heading>
        </div>
      </Styled.Title>
      <Styled.Grid>
        <Styled.Inpt>
          <AnimatedInput name="search" placeholder={RVDic?.Search} />
        </Styled.Inpt>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Styled.DateContainer>
            {/* <FilledCalendarIcon size={20} /> */}
            <CustomDatePicker
              label={RVDic?.SelectDate}
              mode="button"
              type="jalali"
              hasFooter
              range
              headerTitle="فیلتر تاریخ "
              onChangeVisibility={setCalendarPickerClicked}
              CustomButton={({ onClick }) => (
                <ShadowButton
                  onClick={() => {
                    onClick();
                  }}
                  $isEnabled={date || calendarPickerClicked}
                  className={
                    calendarPickerClicked || date
                      ? 'rv-border-distant rv-default'
                      : 'rv-border-white rv-distant'
                  }>
                  {date ? (
                    <FilledCalendarIcon size={20} className={'rv-default'} />
                  ) : (
                    <EmptyCalendarIcon
                      size={20}
                      className={
                        calendarPickerClicked || dateHover
                          ? 'rv-default'
                          : 'rv-distant'
                      }
                    />
                  )}
                </ShadowButton>
              )}
              onDateSelect={(value) => {
                setDate(value);
                console.log('value', value.from, value.to);
                setDateFrom(value.from);
                setDateTo(value.to);
                console.log(dateFrom);
                console.log(dateTo);
                console.log('value', value);
                // onByDate(value);
              }}
            />
          </Styled.DateContainer>
          {/* <Styled.ExcelContainer>
            <OfficeIcons
              type="excel"
              size={20}
              className="search-export-excel"
              onClick={getExcelFile}
            />
          </Styled.ExcelContainer> */}

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
                <RefreshIcon size={17} />
              </span>
              <span
                style={{
                  fontSize: '.7rem',
                  // display: 'flex',
                  // justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                {RVDic?.Update}
              </span>
            </Space>
          </Button>
        </div>
      </Styled.Grid>
      <Styled.BtnGrid style={{ marginTop: '1rem' }}>
        <Styled.btn>
          <TextButton
            className="primary"
            style={{
              border: '1px solid var(--rv-gray-color-dark)',
              padding: '.7rem .2rem',
              margin: '0.5rem',
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
        </Styled.btn>

        <Styled.btn>
          <TextButton
            className="primary"
            style={{
              border: '1px solid var(--rv-gray-color-dark)',
              padding: '.7rem .2rem',
              margin: '0.5rem',

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
                {data && data.Application.CreatedNodesCount}
              </label>
            </div>
          </TextButton>
        </Styled.btn>

        <Styled.btn>
          <TextButton
            className="primary"
            style={{
              border: '1px solid var(--rv-gray-color-dark)',
              padding: '.7rem .3rem',
              margin: '0.5rem',

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
        </Styled.btn>

        <Styled.btn>
          <TextButton
            className="primary"
            style={{
              border: '1px solid var(--rv-gray-color-dark)',
              padding: '.7rem .2rem',
              margin: '0.5rem',

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
        </Styled.btn>

        <Styled.btn>
          <TextButton
            className="primary"
            style={{
              border: '1px solid var(--rv-gray-color-dark)',
              padding: '.7rem .2rem',
              margin: '0.5rem',

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
        </Styled.btn>
        {/* </Styled.BtnGrid>
        <Styled.BtnGrid> */}
        <Styled.btn>
          <TextButton
            className="primary"
            style={{
              border: '1px solid var(--rv-gray-color-dark)',
              padding: '.7rem .2rem',
              margin: '0.5rem',
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
                {/* حجم مورد استفاده */}
                {RVDic?.UsedTemplates}
              </label>
              <label style={{ fontWeight: 'bold' }}>
                {data && data.Application.TotalTemplatesCount}
              </label>
            </div>
          </TextButton>
        </Styled.btn>

        <Styled.btn>
          <TextButton
            className="primary"
            style={{
              border: '1px solid var(--rv-gray-color-dark)',
              padding: '.7rem .2rem',
              margin: '0.5rem',

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
                {/* حجم مورد استفاده */}
                {RVDic?.Searches}
              </label>
              <label style={{ fontWeight: 'bold' }}>
                {data && data.Application.SearchCount}
              </label>
            </div>
          </TextButton>
        </Styled.btn>

        <Styled.btn>
          <TextButton
            className="primary"
            style={{
              border: '1px solid var(--rv-gray-color-dark)',
              padding: '.7rem .2rem',
              margin: '0.5rem',
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
                {/* حجم مورد استفاده */}
                {RVDic?.Login}
              </label>
              <label style={{ fontWeight: 'bold' }}>
                {data && data.Application.LoginCount}
              </label>
            </div>
          </TextButton>
        </Styled.btn>

        <Styled.btn>
          <TextButton
            className="primary"
            style={{
              border: '1px solid var(--rv-gray-color-dark)',
              padding: '.7rem .2rem',
              margin: '0.5rem',
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
                {/* حجم مورد استفاده */}
                {RVDic?.Attachments}
              </label>
              <label style={{ fontWeight: 'bold' }}>
                {data && data.Application.Attachments}
              </label>
            </div>
          </TextButton>
        </Styled.btn>
      </Styled.BtnGrid>
      {usersMarkup}
    </Styled.Container>
  );
};

export default Teams;
