import APIHandler from 'apiHelper/APIHandler';
import Button from 'components/Buttons/Button';
import ToggleButton from 'components/Buttons/Toggle/Toggle';
import Heading from 'components/Heading/Heading';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import UndoIcon from 'components/Icons/UndoIcon/Undo';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import PerfectScrollBar from 'components/ScrollBarProvider/ScrollBarProvider';
import SimpleListViewer from 'components/SimpleListViewer/SimpleListViewer';
import { C_DISTANT } from 'constant/Colors';
import { CV_DISTANT } from 'constant/CssVariables';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import React, { useEffect, useRef, useState } from 'react';
import PeopleItem from './PeopleItem';
import {
  Apply_Picked,
  Container,
  PeopleBody,
  PeopleList,
  PickedList,
  JustMeSaved,
  SearchInput,
  ResetContainer,
} from './PepolePicker.style';
import PickedPeopleItem from './PickedPeopleItem';

const { RVDic, RV_RTL } = window;

const getUsersAPI = new APIHandler('UsersAPI', 'GetUsers');

const PeoplePicker = ({
  buttonComponent,
  onByMe,
  onByPeople,
  isByMe,
  pickedPeople,
}) => {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [peopleList, setPeopleList] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [extraData, setExtraData] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [choosedPeople, setChoosedPeople] = useState([]);
  const [isJustMe, setIsJustMe] = useState(false);

  const pickerRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        // onClick();
        console.log('outside clicked');

        setPickerVisible(false);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [pickerRef]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {}, [choosedPeople]);

  const onChoose = (item) => {
    onByPeople && onByPeople(item);
    setPickerVisible(false);
    // const choosedIndex = choosedPeople.indexOf((x) => x.id === item.id);
    // if (choosedIndex === -1) {
    //   let temp_list = choosedPeople;
    //   temp_list.push(item);
    //   console.log(temp_list, 'temp');
    //   setChoosedPeople(temp_list);
    // }
  };

  const onPicker = () => {
    setPickerVisible(!isPickerVisible);
  };

  const fetchUsers = (count = 20, lowerBoundary = 1, done) => {
    getUsersAPI.fetch(
      {
        SearchText: encodeBase64(searchInput),
        Count: count,
        LowerBoundary: lowerBoundary,
      },
      (response) => {
        console.log(response, 'response');

        const users = response.Users.map((user) => ({
          id: user?.UserID,
          name: decodeBase64(user?.FullName),
          avatarUrl: user?.ImageURL,
        }));
        //   resolve(users);
        if (done) {
          console.log(done, 'done');
          done(users);
        }
        setPeopleList(users);
        setIsFetching(false);
      },
      (error) => {
        console.log(error);
        setIsFetching(false);
      }
    );
  };
  const onFetchAgain = () => {
    setExtraData(!extraData);
  };
  const onJustMe = (e) => {
    console.log(e, 'setIsJustMe');
    setIsJustMe(e);
  };
  const onInput = (event) => {
    setSearchInput(event?.target?.value);
  };

  return (
    <Container ref={pickerRef}>
      {/* {buttonComponent} */}
      {isFetching ? (
        <LogoLoader />
      ) : (
        React.cloneElement(buttonComponent, { onClick: onPicker })
      )}

      <PeopleBody
        className={'rv-bg-color-white rv-border-radius-half'}
        isVisible={isPickerVisible}>
        <ResetContainer>
          <Heading type={'H6'}>{RVDic.ResetPassword}</Heading>
          <UndoIcon
            style={{
              cursor: 'pointer',
              transform: 'scaleX(-1)',
              marginRight: '1rem',
            }}
            onClick={() => onChoose(null)}
            className={C_DISTANT}
            size={16}
          />
        </ResetContainer>
        {/* <Apply_Picked>
          <PickedList>
            {choosedPeople &&
              choosedPeople.length > 0 &&
              choosedPeople.map((x, index) => (
                <>
                  {index < 5 ? (
                    <PickedPeopleItem
                      key={index}
                      avatarUrl={x.avatarUrl}
                      index={index}
                    />
                  ) : (
                    <Heading>{choosedPeople.length - 5}</Heading>
                  )}
                </>
              ))}
          </PickedList>
          <Button type={'o-primary'}>{RVDic.Add}</Button>
        </Apply_Picked> */}

        <SearchInput
          placeholder={RVDic.Search + ' ' + RVDic.In + ' ' + RVDic.Teams}
          onChange={onInput}
          className={'rv-border-warm-red'}
          value={searchInput}
          disabled={false}
          afterChangeListener={onFetchAgain}
          style={{ borderColor: CV_DISTANT }}
          children={
            <SearchIcon
              style={{
                marginTop: '1rem',
                transform: `${RV_RTL ? 'rotate(0deg)' : 'rotate(90deg)'}`,
              }}
              className={'rv-distant'}
            />
          }
        />
        {console.log(isByMe, 'isByMe')}
        <JustMeSaved>
          <Heading type={'H6'}>{'فقط آن چه من ثبت کرده ام'}</Heading>

          <ToggleButton onToggle={onByMe} initialCheck={!!isByMe} />
        </JustMeSaved>
        <PeopleList>
          <PerfectScrollBar>
            <SimpleListViewer
              fetchMethod={fetchUsers}
              extraData={extraData}
              onEndReached={() => {
                console.log('Im reached end');
              }}
              onTotal={(total) => {}}
              renderItem={(x, index) => (
                <PeopleItem
                  pickedPeople={pickedPeople?.id === x.id}
                  onClick={onChoose}
                  item={x}
                  key={index}
                />
              )}
            />
          </PerfectScrollBar>
        </PeopleList>
      </PeopleBody>
    </Container>
  );
};

export default PeoplePicker;
