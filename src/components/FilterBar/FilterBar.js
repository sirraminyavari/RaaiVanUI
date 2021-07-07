/**
 * A component for applying the simple search tools.
 */
import APIHandler from 'apiHelper/APIHandler';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';
import AnimatedDropDownList from 'components/DropDownList/AnimatedDropDownList';
import Heading from 'components/Heading/Heading';
import AddIcon from 'components/Icons/AddIcon/AddIcon';
import FilledBookmarkIcon from 'components/Icons/BookmarkIcon/FilledBookmark';
import OutLineBookmarkIcon from 'components/Icons/BookmarkIcon/OutlineBookmark';
import EmptyCalendarIcon from 'components/Icons/CalendarIcon/EmptyCalendarIcon';
import FilledCalendarIcon from 'components/Icons/CalendarIcon/FilledCalendarIcon';
import Filter from 'components/Icons/FilterIcon/Filter';
import FlashIcon from 'components/Icons/FlashIcon/FlashIcon';
import PersonIcon from 'components/Icons/PersonIcon/PersonIcon';
import Search from 'components/Icons/SearchIcon/Search';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import PeoplePicker from 'components/PeoplePicker/PeoplePicker';
import { decodeBase64 } from 'helpers/helpers';
import { decode } from 'js-base64';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createSelector } from 'reselect';
import { BottomRow, Container, ShadowButton, TopRow } from './FilterBar.style';
import SubmitNewNode from 'apiHelper/SubmitNewNode';
import { CV_WHITE } from 'constant/CssVariables';

const selectedTeam = createSelector(
  (state) => state?.theme,
  (theme) => theme?.selectedTeam
);

const { RVDic, RVAPI, RV_RTL } = window || {};

const LOCAL_STORAGE_PRE_TEXT = 'addNode_';
const data = [
  {
    icon: <FlashIcon className={'rv-default'} style={{ fontSize: '1.2rem' }} />,
    label: RVDic?.AddQuickly,
    value: 'urgentAction',
    colorClass: 'rv-default',
  },
  {
    icon: <AddIcon className={'rv-default'} style={{ fontSize: '1.2rem' }} />,
    label: RVDic?.AddWithDetails,
    value: 'completeAction',
    colorClass: 'rv-default',
  },
];

const checkNodeCreationAccess = new APIHandler(
  'CNAPI',
  'CheckNodeCreationAccess'
);
const ownerForm = new APIHandler('FGAPI', 'GetOwnerForm');
const formElements = new APIHandler('FGAPI', 'GetFormElements');

/**
 *
 * @callback onSearch - By typing some thing in the search input will fire.
 * @callback onByDate - By picking some date will fire.
 * @param {Boolean} - If True, AdvancedSearch button will be in the clicked mode.
 * @callback - By clicking the AdvancedSearch button will fire.
 * @param {String} - Id for nodeType.
 * @callback onFormElements - By fetching it,Passes formElement to up
 * @returns
 */
const FilterBar = ({
  nodeType,
  onSearch,
  onByDate,
  onByPeople,
  advancedSearch,
  onAdvanecedSearch,
  nodeTypeId,
  onFormElements,
  totalFound,
  hierarchy,
  onForceFetch,
  onCreateUrgent,
  onByMe,
  isByMe,
  people,
  onByStatus,
  onByBookmarked,
  isBookMarked,
}) => {
  const teamName = useSelector((state) => state?.theme?.selectedTeam?.name);

  const defaultDropDownLabel = {
    icon: (
      <AddIcon color={'white'} style={{ fontSize: '1.2rem', color: 'red' }} />
    ),
    label: RVDic?.NewN?.replace(
      '[n]',
      !_.isEmpty(hierarchy) ? decode(hierarchy[0]?.TypeName) : ''
    ),
    value: null,
    color: 'white',
  };

  // Typed value in search input.
  const [searchText, setSearchText] = useState('');
  // if True, filters Bookmarked nodes(under develop)
  // const [bookmarked, setBookmarked] = useState(false);

  // if has value, filters node that is in the period of the selected date.
  const [date, setDate] = useState(null);
  // Creating dropdown content.
  const [market, setMarket] = useState(null);
  // if True, side bar filter will appear.
  const [advancedButton, setAdvancedButton] = useState(false);
  // selected item for creating type.
  const [selectedItem, setSelectedItem] = useState(defaultDropDownLabel);
  // if True, means DropDown is open
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  // if True, means mouse hovers the filter button.
  const [filterHover, setFilterHover] = useState(false);
  // if True, means mouse hovers the date button.
  const [dateHover, setDateHover] = useState(false);
  // if True, means mouse hovers the people button.
  const [peopleHover, setPeopleHover] = useState(false);
  // if True, means mouse hovers the bookmark button.
  const [bookmarkHover, setBookmarkHover] = useState(false);

  const selectedApp = useSelector(selectedTeam);
  const { push } = useHistory();

  /**
   * Gets user access for creating document.
   * @returns
   */
  const getCreationAccess = () =>
    checkNodeCreationAccess?.fetch({ NodeTypeID: nodeTypeId }, (dt) => {
      // If the user has access can choose between two items.
      if (dt?.Result) {
        // setCreationData(data);
        setMarket(data);
      } else {
        setMarket(null);
      }
      getOwnerForm();
    });

  // By mounting component at the first time, fetches creation access.
  useEffect(() => {
    getCreationAccess();
  }, []);

  // Gets typeName by retrieving it from the hierarchy.
  const getTypeName = () => {
    return nodeType?.TypeName
      ? decode(nodeType?.TypeName)
      : teamName
      ? teamName
      : '';
  };
  // By changing 'hierarchy' will fire.
  useEffect(() => {
    if (nodeTypeId) {
      getCreationAccess();

      const newMarketingHistoryRaw = localStorage?.getItem(
        LOCAL_STORAGE_PRE_TEXT + nodeTypeId
      );
      const newMarketingHistory = JSON?.parse(newMarketingHistoryRaw);
      // Checks if the user has selection history set it for default.
      // By clicking the dropdown label.
      // selected item in past will fire.
      const findLastChoose =
        newMarketingHistory &&
        data?.find((x) => x?.value === newMarketingHistory);
      setSelectedItem({
        ...selectedItem,
        label: RVDic?.NewN?.replace('[n]', getTypeName()),
        icon:
          _.isObject(findLastChoose) &&
          React.cloneElement(findLastChoose?.icon, { color: 'white' }),
        value: _.isObject(findLastChoose) && findLastChoose?.value,
      });
    }
  }, [nodeTypeId]);

  // Fetchs formElements according to formId that obtained from 'getOwnerForm' and 'nodeTypeId' passed to component
  const getFormElements = (formId) => {
    formElements.fetch(
      {
        FormID: formId,
        OwnerID: nodeTypeId,
        ConsiderElementLimits: true,
      },
      (result) => {
        let filters = result && result?.Elements;
        if (filters && filters?.length > 0) {
          setAdvancedButton(true);
        } else {
          setAdvancedButton(false);
        }
        onFormElements(filters);
      }
    );
  };
  // Fetches formElements according to passed 'nodeTypeId'
  const getOwnerForm = () => {
    ownerForm?.fetch({ OwnerID: nodeTypeId }, (result) => {
      let formId = (result || {})?.FormID;
      // let formTitle = decode((result || {}).Title);

      if (formId) {
        //form filters is enabled
        // setAdvancedButton(true);
        getFormElements(formId);
      }
    });
  };

  // By clicking on the dropdown items will fire.
  const onSelectItem = (item) => {
    if (item && item?.value) {
      localStorage?.setItem(
        LOCAL_STORAGE_PRE_TEXT + nodeTypeId,
        JSON?.stringify(item?.value)
      );
      setSelectedItem({
        ...selectedItem,
        icon: React.cloneElement(item.icon, {
          color: 'white',
          fontSize: '1.2rem',
        }),
        value: item?.value,
        color: CV_WHITE,
      });

      if (item.value === 'completeAction') {
        push(RVAPI?.NewNodePageURL({ NodeTypeID: nodeTypeId }));
        // SubmitNewNode(nodeTypeId);
        // window.open(RVAPI.NewNodePageURL({ NodeTypeID: nodeTypeId }));
      } else if (item?.value === 'urgentAction') {
        // setUrgentModalOpen(true);
        onCreateUrgent();
      }
    } else {
      // SubmitNewNode(nodeTypeId);
      push(RVAPI?.NewNodePageURL({ NodeTypeID: nodeTypeId }));
    }
  };
  // By typing in the search input will fire
  const onTextSearch = (value) => {
    setSearchText(value);
  };
  const onAdvancedFilterClick = () => {
    setTimeout(() => {
      onAdvanecedSearch(!advancedSearch);
    }, 0);
  };

  const onPeople = (item) => {
    onByPeople(item);
  };

  // const placeHolderText = () => {
  //   if (getTypeName() !== '') {
  //     return (
  //       RVDic.SearchInN.replace(
  //         '[n]',

  //         getTypeName()
  //       ) +
  //       ' (' +
  //       RVDic.Title +
  //       ' - ' +
  //       RVDic.AdditionalID +
  //       ' - ' +
  //       RVDic.Keywords +
  //       ')'
  //     );
  //   }
  //   return (
  //     RVDic.Search +
  //     ' (' +
  //     RVDic.Title +
  //     ' - ' +
  //     RVDic.AdditionalID +
  //     ' - ' +
  //     RVDic.Keywords +
  //     ')'
  //   );
  // };

  const extendedHierarchy = hierarchy?.map((level) => ({
    id: level?.NodeTypeID,
    title: decodeBase64(level?.TypeName),
    linkTo: `/classes/${level?.NodeTypeID}`,
  }));

  const breadcrumbItems = [
    { id: selectedApp?.id, title: selectedApp?.name, linkTo: '/classes' },
    ...extendedHierarchy,
  ];

  return (
    <Container>
      <Breadcrumb items={breadcrumbItems} />
      <TopRow>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: '1.5rem',
          }}>
          {nodeType?.IconURL && (
            <img
              alt={''}
              style={{ height: '3rem', aspectRatio: 1 }}
              src={nodeType?.IconURL}
            />
          )}
          <Heading style={{ margin: '0 1rem 0 0rem' }} type={'h1'}>
            {getTypeName()}
          </Heading>
          {!_.isNull(totalFound) && (
            <Heading style={{ margin: '0 1rem 0 1rem' }} type={'h6'}>
              {RVDic?.NItems?.replace('[n]', totalFound)}
            </Heading>
          )}
        </div>

        {(market || []).length > 0 && (
          <AnimatedDropDownList
            data={market}
            onSelectItem={onSelectItem}
            defaultValue={selectedItem}
            hiddenSelectedItem={false}
            onClickLabel={() => onSelectItem(selectedItem)}
            customStyle={{
              label: { minWidth: '8rem' },
            }}
            customClass={{
              labelClass: RV_RTL
                ? 'rv-bg-color-default rv-border-radius-half rv-ignore-left-radius'
                : 'rv-bg-color-default rv-border-radius-half rv-ignore-right-radius',
              buttonClass: isDropDownOpen
                ? `rv-bg-color-warm rv-border-radius-half ${
                    RV_RTL ? 'rv-ignore-right-radius' : 'rv-ignore-left-radius'
                  }`
                : `rv-bg-color-default rv-border-radius-half ${
                    RV_RTL ? 'rv-ignore-right-radius' : 'rv-ignore-left-radius'
                  }`,
              arrowIconColorClass: 'rv-white',
            }}
            onDropDownOpen={setIsDropDownOpen}
          />
        )}
      </TopRow>

      <BottomRow>
        <AnimatedInput
          value={searchText}
          placeholderClass={'rv-distant'}
          onChange={onTextSearch}
          afterChangeListener={() => onSearch(searchText)}
          style={{ maxWidth: '60%' }}
          placeholder={RVDic?.Search}
          placeholderFocusedClass={'rv-default'}
          children={
            <Search
              style={{
                transform: `${RV_RTL ? 'rotate(0deg)' : 'rotate(90deg)'}`,
              }}
              className={'rv-distant'}
            />
          }
        />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <CustomDatePicker
            label={RVDic?.SelectDate}
            mode="button"
            type="jalali"
            clearButton
            range
            headerTitle="فیلتر تاریخ ایجاد"
            CustomButton={({ onClick }) => (
              <ShadowButton
                onClick={onClick}
                onMouseEnter={() => setDateHover(true)}
                onMouseLeave={() => setDateHover(false)}
                style={commonStyle}
                $isEnabled={date}
                className={
                  date
                    ? 'rv-border-distant rv-default'
                    : 'rv-border-white rv-distant'
                }>
                {date ? (
                  <FilledCalendarIcon
                    size={'1.5rem'}
                    className={'rv-default'}
                  />
                ) : (
                  <EmptyCalendarIcon
                    size={'1.5rem'}
                    className={dateHover ? 'rv-default' : 'rv-distant'}
                  />
                )}
              </ShadowButton>
            )}
            onDateSelect={(value) => {
              setDate(value);
              onByDate(value);
            }}
          />
          <ShadowButton
            style={commonStyle}
            onMouseEnter={() => setBookmarkHover(true)}
            onMouseLeave={() => setBookmarkHover(false)}
            onClick={() => onByBookmarked(!isBookMarked)}
            $isEnabled={isBookMarked}
            className={
              isBookMarked
                ? 'rv-border-distant rv-default'
                : 'rv-border-white rv-distant'
            }>
            {isBookMarked ? (
              <FilledBookmarkIcon size={'1.5rem'} className={'rv-default'} />
            ) : (
              <OutLineBookmarkIcon
                size={'1.5rem'}
                className={bookmarkHover ? 'rv-default' : 'rv-distant'}
              />
            )}
          </ShadowButton>

          <PeoplePicker
            onByMe={onByMe}
            onByPeople={onPeople}
            isByMe={isByMe}
            pickedPeople={people}
            buttonComponent={
              <ShadowButton
                style={commonStyle}
                // onClick={onClick}
                onMouseEnter={() => setPeopleHover(true)}
                onMouseLeave={() => setPeopleHover(false)}
                $isEnabled={people || isByMe}
                className={
                  isByMe || people
                    ? 'rv-border-distant rv-default'
                    : 'rv-border-white rv-distant'
                }>
                <PersonIcon
                  size={'1.5rem'}
                  className={
                    isByMe || people
                      ? 'rv-default'
                      : peopleHover
                      ? 'rv-default'
                      : 'rv-distant'
                  }
                />
              </ShadowButton>
            }
          />

          {advancedButton && (
            <ShadowButton
              style={{
                marginRight: '0.5rem',
                minWidth: '7rem',
                color:
                  advancedSearch || filterHover ? 'rv-default' : 'rv-distant',
              }}
              onMouseEnter={() => setFilterHover(true)}
              onMouseLeave={() => setFilterHover(false)}
              onClick={onAdvancedFilterClick}
              $isEnabled={advancedSearch}
              className={
                advancedSearch
                  ? 'rv-border-distant rv-default'
                  : 'rv-border-white rv-distant'
              }>
              <Filter
                size={'1.5rem'}
                className={
                  advancedSearch
                    ? 'rv-default'
                    : filterHover
                    ? 'rv-default'
                    : 'rv-distant'
                }
                style={{ marginLeft: '0.5rem' }}
              />
              {RVDic?.Advanced}
            </ShadowButton>
          )}
        </div>
      </BottomRow>
    </Container>
  );
};
export default FilterBar;

const commonStyle = { width: '3rem', aspectRatio: '1', marginRight: '0.5rem' };
