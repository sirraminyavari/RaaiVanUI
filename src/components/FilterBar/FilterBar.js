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
import React, { useEffect, useState } from 'react';
import { BottomRow, Container, ShadowButton, TopRow } from './FilterBar.style';

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
        setAdvancedButton(true);
        getFormElements(formId);
      }
    });
  };

  // By clicking on the dropdown items will fire.
  const onSelectItem = (item) => {
    localStorage.setItem(nodeTypeId, JSON.stringify(item.value));
    setSelectedItem({
      icon: React.cloneElement(item.icon, { color: 'white' }),
      label: item.label,
      value: item.value,
      color: 'white',
    });
  };
  // By typing in the search input will fire
  const onTextSearch = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <Container>
      <TopRow>
        {market?.length > 0 && (
          <AnimatedDropDownList
            data={market}
            onSelectItem={onSelectItem}
            defaultValue={selectedItem}
            hiddenSelectedItem={false}
            onClickLabel={() => console.log('label clicked!')}
            customStyle={{
              button: { backgroundColor: '#2B388F' },
              label: {
                backgroundColor: '#2B7BE4',
                borderTopRightRadius: '0.5rem',
                borderBottomRightRadius: '0.5rem',
              },
              arrowIconColor: 'white',
            }}
          />
        )}
      </TopRow>
      <BottomRow>
        <Input
          value={searchText}
          onChange={onTextSearch}
          afterChangeListener={() => onSearch(searchText)}
          placeholder={
            'جستجو در اسناد مارکتینگ (عنوان ، کد رهگیری ، کلمات کلیدی)'
          }
          style={{ width: '60%', marginRight: '3rem' }}
        />

        <ShadowButton
          style={commonStyle}
          onClick={() => onAdvanecedSearch(!advancedSearch)}
          isEnabled={bookmarked}>
          {bookmarked ? (
            <FilledBookmarkIcon size={'1rem'} color={'#2B7BE4'} />
          ) : (
            <OutLineBookmarkIcon size={'1rem'} color={'#BAC9DC'} />
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
              style={commonStyle}
              isEnabled={date}>
              {date ? (
                <FilledCalendarIcon size={'1rem'} color={'#2B7BE4'} />
              ) : (
                <EmptyCalendarIcon size={'1rem'} color={'#BAC9DC'} />
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
          isEnabled={people}>
          <PersonIcon size={'1rem'} color={people ? '#2B7BE4' : '#BAC9DC'} />
        </ShadowButton>

        {advancedButton && (
          <ShadowButton
            style={{
              marginRight: '0.5rem',
              minWidth: '7rem',
            }}
            onClick={() => onAdvanecedSearch(!advancedSearch)}
            isEnabled={advancedSearch}>
            <Filter
              size={'1rem'}
              color={advancedSearch ? '#2B7BE4' : '#BAC9DC'}
            />
            {'فیلتر   پیشرفته'}
          </ShadowButton>
        )}
      </BottomRow>
    </Container>
  );
};
export default FilterBar;

const commonStyle = { width: '3rem', aspectRatio: '1', marginRight: '0.5rem' };
