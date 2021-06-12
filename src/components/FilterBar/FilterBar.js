/**
 * A component for applying the simple search tools.
 */
import APIHandler from 'apiHelper/APIHandler';
import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';
import AnimatedDropDownList from 'components/DropDownList/AnimatedDropDownList';
import AddIcon from 'components/Icons/AddIcon/AddIcon';
import FilledBookmarkIcon from 'components/Icons/BookmarkIcon/FilledBookmark';
import OutLineBookmarkIcon from 'components/Icons/BookmarkIcon/OutlineBookmark';
import EmptyCalendarIcon from 'components/Icons/CalendarIcon/EmptyCalendarIcon';
import FilledCalendarIcon from 'components/Icons/CalendarIcon/FilledCalendarIcon';
import Filter from 'components/Icons/FilterIcon/Filter';
import FlashIcon from 'components/Icons/FlashIcon/FlashIcon';
import PersonIcon from 'components/Icons/PersonIcon/PersonIcon';
import Input from 'components/Inputs/Input';
import Search from 'components/Icons/SearchIcon/Search';
import React, { useEffect, useState } from 'react';
import { BottomRow, Container, ShadowButton, TopRow } from './FilterBar.style';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import DimensionHelper from 'utils/DimensionHelper/DimensionHelper';
import Breadcrumb from './Breadcrumb';
import Heading from 'components/Heading/Heading';
import useCheckRoute from 'hooks/useCheckRoute';
import { decode } from 'js-base64';

const data = [
  {
    icon: <FlashIcon color={'#2B7BE4'} />,
    label: 'افزودن فوری',
    value: 'a',
    color: '#2B7BE4',
  },
  {
    icon: <AddIcon color={'#2B7BE4'} />,
    label: 'ثبت کامل اطلاعات',
    value: 'b',
    color: '#2B7BE4',
  },
];

const checkNodeCreationAccess = new APIHandler(
  'CNAPI',
  'CheckNodeCreationAccess'
);
const ownerForm = new APIHandler('FGAPI', 'GetOwnerForm');
const formElements = new APIHandler('FGAPI', 'GetFormElements');

const defaultDropDownLabel = {
  icon: <AddIcon color={'white'} />,
  label: 'سند مارکتینگ جدید',
  value: 'b',
  color: 'white',
};
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
}) => {
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

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const [filterHover, setFilterHover] = useState(false);
  const [dateHover, setDateHover] = useState(false);
  const [peopleHover, setPeopleHover] = useState(false);
  const [bookmarkHover, setBookmarkHover] = useState(false);

  // By mounting component at the first time, fetches creation access.
  useEffect(() => {
    getCreationAccess();
  }, []);
  /**
   * Gets user access for creating document.
   * @returns
   */
  const getCreationAccess = () =>
    checkNodeCreationAccess.fetch({ NodeTypeID: nodeTypeId }, (dt) => {
      const newMarketingHistoryRaw = localStorage.getItem(nodeTypeId);
      const newMarketingHistory = JSON.parse(newMarketingHistoryRaw);
      // Checks if the user has selection history set it for default.
      // By clicking the dropdown label.
      // selected item in past will fire.
      if (newMarketingHistory) {
        const findLastChoose = data.find(
          (x) => x.value === newMarketingHistory
        );
        if (findLastChoose) {
          setSelectedItem({
            ...selectedItem,
            icon: React.cloneElement(findLastChoose?.icon, { color: 'white' }),
            value: findLastChoose.value,
          });
        }
      }
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
  };
  // By typing in the search input will fire
  const onTextSearch = (e) => {
    setSearchText(e.target.value);
  };

  const checkRoute = useCheckRoute();

  return (
    <Container>
      <Breadcrumb />
      <TopRow>
        {console.log(hierarchy, 'hierarchy')}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {hierarchy && hierarchy.length > 0 && hierarchy[0]?.IconURL && (
            <img
              style={{ height: '3rem', aspectRatio: 1 }}
              src={hierarchy[0]?.IconURL}
            />
          )}
          {hierarchy && hierarchy.length > 0 && hierarchy[0]?.TypeName && (
            <Heading style={{ margin: '0 1rem 0 0rem' }} type={'h1'}>
              {decode(hierarchy[0].TypeName)}
            </Heading>
          )}
          {totalFound && (
            <Heading style={{ margin: '0 1rem 0 1rem' }} type={'h6'}>
              {totalFound + ' مورد'}
            </Heading>
          )}
        </div>

        {market?.length > 0 && (
          <AnimatedDropDownList
            data={market}
            onSelectItem={onSelectItem}
            defaultValue={selectedItem}
            hiddenSelectedItem={false}
            onClickLabel={() => console.log('label clicked!')}
            customStyle={{
              button: {
                backgroundColor: isDropDownOpen ? '#2B388F' : '#2B7BE4',
              },
              label: {
                backgroundColor: '#2B7BE4',
                borderTopRightRadius: '0.5rem',
                borderBottomRightRadius: '0.5rem',
              },
              arrowIconColor: 'white',
            }}
            onDropDownOpen={setIsDropDownOpen}
          />
        )}
      </TopRow>

      <BottomRow>
        <AnimatedInput
          value={searchText}
          placholderClass={'rv-distant'}
          onChange={onTextSearch}
          afterChangeListener={() => onSearch(searchText)}
          placeholder={
            DimensionHelper().isTabletOrMobile
              ? 'جستجو'
              : 'جستجو در اسناد مارکتینگ (عنوان ، کد رهگیری ، کلمات کلیدی)'
          }
          children={<Search className={'rv-distant'} />}
          style={{ maxWidth: '40%', placeholderColor: 'red' }}
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
              {'پیشرفته'}
            </ShadowButton>
          )}
        </div>
      </BottomRow>
    </Container>
  );
};
export default FilterBar;

const commonStyle = { width: '3rem', aspectRatio: '1', marginRight: '0.5rem' };
