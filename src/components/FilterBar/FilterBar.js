/**
 * A component for applying the simple search tools.
 */
import APIHandler from 'apiHelper/APIHandler';
import Button from 'components/Buttons/Button';
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
import Modal from 'components/Modal/Modal';
import { decode, encode } from 'js-base64';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import Breadcrumb from './Breadcrumb';
import { BottomRow, Container, ShadowButton, TopRow } from './FilterBar.style';

const { RVDic, RVAPI, RV_RTL } = window;
const data = [
  {
    icon: <FlashIcon className={'rv-default'} />,
    label: RVDic.AddQuickly,
    value: 'urgentAction',
    colorClass: 'rv-default',
  },
  {
    icon: <AddIcon className={'rv-default'} />,
    label: RVDic.AddWithDetails,
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
const newNodePage = new APIHandler('RVAPI', 'NewNodePageURL');
const addNode = new APIHandler('CNAPI', 'AddNode');

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
  onSearch,
  onByStatus,
  onByDate,
  onByPeople,
  onByBookmarked,
  advancedSearch,
  onAdvanecedSearch,
  nodeTypeId,
  onFormElements,
  totalFound,
  hierarchy,
  onForceFetch,
}) => {
  const defaultDropDownLabel = {
    icon: <AddIcon color={'white'} />,
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
  const [bookmarked, setBookmarked] = useState(false);
  // if True, filters nodes created by specific people(under develop)
  const [people, setPeople] = useState(false);
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
  // if true, means the modal for creating urgent subject is open
  const [isUrgentModalOpen, setUrgentModalOpen] = useState(false);
  // user inputs for creating urgent subject item.
  const [urgentInput, setUrgentInput] = useState('');

  // By mounting component at the first time, fetches creation access.
  useEffect(() => {
    getCreationAccess();
  }, []);
  // Gets typeName by retrieving it from the hierarchy.
  const getTypeName = () => {
    return !_.isEmpty(hierarchy) ? decode(hierarchy[0].TypeName) : '';
  };
  // By changing 'hierarchy' will fire.
  useEffect(() => {
    if (_.isArray(hierarchy)) {
      const newMarketingHistoryRaw = localStorage.getItem(nodeTypeId);
      const newMarketingHistory = JSON.parse(newMarketingHistoryRaw);
      // Checks if the user has selection history set it for default.
      // By clicking the dropdown label.
      // selected item in past will fire.
      const findLastChoose =
        newMarketingHistory &&
        data.find((x) => x.value === newMarketingHistory);
      console.log(getTypeName(), 'getTypeName');
      setSelectedItem({
        ...selectedItem,
        label: RVDic.NewN.replace('[n]', getTypeName()),
        icon:
          _.isObject(findLastChoose) &&
          React.cloneElement(findLastChoose?.icon, { color: 'white' }),
        value: _.isObject(findLastChoose) && findLastChoose.value,
      });
    }
  }, [hierarchy]);

  /**
   * Gets user access for creating document.
   * @returns
   */
  const getCreationAccess = () =>
    checkNodeCreationAccess.fetch({ NodeTypeID: nodeTypeId }, (dt) => {
      // If the user has access can choose between two items.
      if (dt.Result) {
        // setCreationData(data);
        setMarket(data);
      } else {
        setMarket([data[0]]);
      }
      getOwnerForm();
    });

  // Fetchs formElements according to formId that obtained from 'getOwnerForm' and 'nodeTypeId' passed to component
  const getFormElements = (formId) => {
    formElements.fetch(
      {
        FormID: formId,
        OwnerID: nodeTypeId,
        ConsiderElementLimits: true,
      },
      (result) => {
        let groupingElements = ((result || {}).Elements || []).filter((e) =>
          ['Select', 'Binary'].some((i) => i == e.Type)
        );
        let filters = (result || {}).Elements || [];
        if (filters.length > 0) {
          setAdvancedButton(true);
        }
        onFormElements(filters);
      }
    );
  };
  // Fetches formElements according to passed 'nodeTypeId'
  const getOwnerForm = () => {
    ownerForm.fetch({ OwnerID: nodeTypeId }, (result) => {
      let formId = (result || {}).FormID;
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
    localStorage.setItem(nodeTypeId, JSON.stringify(item.value));
    setSelectedItem({
      ...selectedItem,
      icon: React.cloneElement(item.icon, { color: 'white' }),
      value: item.value,
      color: 'white',
    });

    if (item.value === 'completeAction') {
      window.open(RVAPI.NewNodePageURL({ NodeTypeID: nodeTypeId }));
    } else if (item.value === 'urgentAction') {
      setUrgentModalOpen(true);
    }
  };
  // By typing in the search input will fire
  const onTextSearch = (value) => {
    setSearchText(value);
  };
  // will fire if user choose create urgent.
  const onCreateUrgent = () => {
    setUrgentModalOpen(false);
    addNode.fetch(
      { NodeTypeID: nodeTypeId, Name: encode(urgentInput) },
      (response) => {
        setUrgentInput('');
        console.log(response, 'response');
        onForceFetch();
      }
    );
  };
  return (
    <Container>
      <Breadcrumb hierarchy={hierarchy} />
      <TopRow>
        {console.log(hierarchy, 'hierarchy', _.isEmpty(hierarchy))}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {!_.isEmpty(hierarchy) && hierarchy[0].IconURL && (
            <img
              style={{ height: '3rem', aspectRatio: 1 }}
              src={hierarchy[0]?.IconURL}
            />
          )}
          <Heading style={{ margin: '0 1rem 0 0rem' }} type={'h1'}>
            {getTypeName()}
          </Heading>
          {!_.isNull(totalFound) && (
            <Heading style={{ margin: '0 1rem 0 1rem' }} type={'h6'}>
              {RVDic.NItems.replace('[n]', totalFound)}
            </Heading>
          )}
        </div>

        {market?.length > 0 && (
          <AnimatedDropDownList
            data={market}
            onSelectItem={onSelectItem}
            defaultValue={selectedItem}
            hiddenSelectedItem={false}
            onClickLabel={() => onSelectItem(selectedItem)}
            customClass={{
              labelClass: RV_RTL
                ? 'rv-bg-color-default rv-border-radius-half rv-ignore-right-radius'
                : 'rv-bg-color-default rv-border-radius-half rv-ignore-left-radius',
              buttonClass: isDropDownOpen
                ? `rv-bg-color-warm rv-border-radius-half ${
                    RV_RTL ? 'rv-ignore-left-radius' : 'rv-ignore-right-radius'
                  }`
                : `rv-bg-color-default rv-border-radius-half ${
                    RV_RTL ? 'rv-ignore-left-radius' : 'rv-ignore-right-radius'
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
          placeholder={
            RVDic.SearchInN.replace(
              '[n]',

              getTypeName()
            ) +
            ' (' +
            RVDic.Title +
            ' - ' +
            RVDic.AdditionalID +
            ' - ' +
            RVDic.Keywords +
            ')'
          }
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
          <ShadowButton
            style={commonStyle}
            onMouseEnter={() => setBookmarkHover(true)}
            onMouseLeave={() => setBookmarkHover(false)}
            onClick={() => onAdvanecedSearch(!advancedSearch)}
            isEnabled={bookmarked}
            className={
              bookmarked
                ? 'rv-border-distant rv-default'
                : 'rv-border-white rv-distant'
            }>
            {bookmarked ? (
              <FilledBookmarkIcon size={'1.5rem'} className={'rv-default'} />
            ) : (
              <OutLineBookmarkIcon
                size={'1.5rem'}
                className={bookmarkHover ? 'rv-default' : 'rv-distant'}
              />
            )}
          </ShadowButton>

          <CustomDatePicker
            label=" انتخاب تاریخ جلالی"
            mode="button"
            type="jalali"
            clearButton
            range
            CustomButton={({ onClick }) => (
              <ShadowButton
                onClick={onClick}
                onMouseEnter={() => setDateHover(true)}
                onMouseLeave={() => setDateHover(false)}
                style={commonStyle}
                isEnabled={date}
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
              console.log(date, 'date');
              setDate(value);
              onByDate(value);
            }}
          />
          <ShadowButton
            style={commonStyle}
            onClick={() => onAdvanecedSearch(!advancedSearch)}
            onMouseEnter={() => setPeopleHover(true)}
            onMouseLeave={() => setPeopleHover(false)}
            isEnabled={people}
            className={
              people
                ? 'rv-border-distant rv-default'
                : 'rv-border-white rv-distant'
            }>
            <PersonIcon
              size={'1.5rem'}
              className={
                people
                  ? 'rv-default'
                  : peopleHover
                  ? 'rv-default'
                  : 'rv-distant'
              }
            />
          </ShadowButton>

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
              onClick={() => onAdvanecedSearch(!advancedSearch)}
              isEnabled={advancedSearch}
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
              {RVDic.Advanced}
            </ShadowButton>
          )}
        </div>
      </BottomRow>
      <div
        style={{
          display: 'flex',
          width: '80vw',
          backgroundColor: 'red',
        }}>
        <Modal
          contentWidth="50%"
          onClose={() => setUrgentModalOpen(false)}
          show={isUrgentModalOpen}>
          <AnimatedInput
            placeholder={'Input something'}
            value={urgentInput}
            onChange={setUrgentInput}
          />
          <Button
            disable={!urgentInput}
            onClick={onCreateUrgent}
            style={{ margin: '2rem' }}
            type={'primary'}>
            {'Confirm'}
          </Button>
        </Modal>
      </div>
    </Container>
  );
};
export default FilterBar;

const commonStyle = { width: '3rem', aspectRatio: '1', marginRight: '0.5rem' };
