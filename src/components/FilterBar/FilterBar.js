import Button from 'components/Buttons/Button';
import Heading from 'components/Heading/Heading';
import AccountManIcon from 'components/Icons/AccountManIcon/AccountManIcon';
import FilledBookmarkIcon from 'components/Icons/BookmarkIcon/FilledBookmark';
import BookmarkIcon from 'components/Icons/BookmarkIcon/FilledBookmark';
import OutLineBookmarkIcon from 'components/Icons/BookmarkIcon/OutlineBookmark';
import EmptyCalendarIcon from 'components/Icons/CalendarIcon/EmptyCalendarIcon';
import FilledCalendarIcon from 'components/Icons/CalendarIcon/FilledCalendarIcon';
import Filter from 'components/Icons/FilterIcon/Filter';
import PersonIcon from 'components/Icons/PersonIcon/PersonIcon';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import Input from 'components/Inputs/Input';
import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { ShadowButton, BottomRow, Container, TopRow } from './FilterBar.style';
import AnimatedDropDownList from 'components/DropDownList/AnimatedDropDownList';
import EditIcon from 'components/Icons/EditIcon/Edit';
import FlashIcon from 'components/Icons/FlashIcon/FlashIcon';
import AddIcon from 'components/Icons/AddIcon/AddIcon';
import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';
import APIHandler from 'apiHelper/APIHandler';
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

const FilterBar = ({
  onSearch,
  onByStatus,
  onByDate,
  onByPeople,
  onByBookmarked,
  advancedSearch,
  onAdvanecedSearch,
  NodeId,
}) => {
  const [searchText, setSearchText] = useState('');
  const [bookmarked, setBookmarked] = useState(false);
  const [people, setPeople] = useState(false);
  const [date, setDate] = useState(null);
  const [creationData, setCreationData] = useState([]);
  const [advancedButton, setAdvancedButton] = useState(false);
  const [selectedItem, setSelectedItem] = useState({
    icon: <AddIcon color={'white'} />,
    label: 'سند مارکتینگ جدید',
    value: 'b',
    color: 'white',
  });
  const getCreationAcces = () =>
    checkNodeCreationAccess.fetch({ NodeTypeID: NodeId }, (dt) => {
      if (dt.Result) {
        console.log('creation access', dt);
        setCreationData(data);
      } else {
        setCreationData([data[1]]);
      }
      getOwnerForm();
    });
  const getOwnerForm = () => {
    ownerForm.fetch({ OwnerID: NodeId }, (result) => {
      let formId = (result || {}).FormID;
      // let formTitle = decode((result || {}).Title);
      console.log('formId', result);

      if (formId) {
        //form filters is enabled
        setAdvancedButton(true);
      }
    });
  };

  useEffect(() => {
    getCreationAcces();
  }, []);

  const onSelectItem = (item) => {
    setSelectedItem(item);
  };
  const onTextSearch = (e) => {
    setSearchText(e.target.value);
  };
  // useEffect(() => {
  //   setTimeout(() => {
  //     onSearch(searchText);
  //     console.log(searchText, 'called after 1s');
  //   }, [1000]);
  // }, [searchText]);

  return (
    <Container>
      <TopRow>
        <AnimatedDropDownList
          data={data}
          onSelectItem={onSelectItem}
          defaultValue={selectedItem}
          hiddenSelectedItem={false}
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
      </TopRow>
      <BottomRow>
        <Input
          value={searchText}
          onChange={onTextSearch}
          afterChangeListener={() => onSearch(searchText)}
          placeholder={
            'جستجو در اسناد مارکتینگ (عنوان ، کد رهگیری ، کلمات کلیدی)'
          }
          style={{ width: '27rem', marginRight: '3rem' }}
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
