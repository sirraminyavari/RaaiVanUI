import APIHandler from 'apiHelper/APIHandler';
import Button from 'components/Buttons/Button';
import Heading from 'components/Heading/Heading';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import PerfectScrollBar from 'components/ScrollBarProvider/ScrollBarProvider';
import SimpleListViewer from 'components/SimpleListViewer/SimpleListViewer';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import React, { useEffect, useRef, useState } from 'react';
import PeopleItem from './PeopleItem';
import {
  Apply_Picked,
  Container,
  PeopleBody,
  PeopleList,
  PickedList,
} from './PepolePicker.style';
import PickedPeopleItem from './PickedPeopleItem';

const { RVDic, RV_RTL } = window;

const getUsersAPI = new APIHandler('UsersAPI', 'GetUsers');

const PeoplePicker = ({ buttonComponent }) => {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [peopleList, setPeopleList] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [extraData, setExtraData] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [choosedPeople, setChoosedPeople] = useState([]);

  const pickerRef = useRef();

  //   useEffect(() => {
  //     function handleClickOutside(event) {
  //       if (pickerRef.current && !pickerRef.current.contains(event.target)) {
  //         // onClick();
  //         console.log('outside clicked');

  //         setPickerVisible(false);
  //       }
  //     }

  //     // Bind the event listener
  //     document.addEventListener('mousedown', handleClickOutside);
  //     return () => {
  //       // Unbind the event listener on clean up
  //       document.removeEventListener('mousedown', handleClickOutside);
  //     };
  //   }, [pickerRef]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    console.log(choosedPeople, 'choosedPeople');
  }, [choosedPeople]);

  const onChoose = (item) => {
    const choosedIndex = choosedPeople.indexOf((x) => x.id === item.id);
    if (choosedIndex === -1) {
      let temp_list = choosedPeople;
      temp_list.push(item);
      console.log(temp_list, 'temp');
      setChoosedPeople(temp_list);
    }
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

  return (
    <Container ref={pickerRef}>
      {/* {buttonComponent} */}
      {isFetching ? (
        <LogoLoader />
      ) : (
        React.cloneElement(buttonComponent, { onClick: onPicker })
      )}
      {console.log(choosedPeople, 'choosedPeople')}

      <PeopleBody
        className={'rv-bg-color-white rv-border-radius-half'}
        isVisible={isPickerVisible}>
        <Apply_Picked>
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
        </Apply_Picked>
        <AnimatedInput
          placeholder={RVDic.Search + ' ' + RVDic.In + ' ' + RVDic.Teams}
          style={{ width: '100%' }}
          onChange={setSearchInput}
          value={searchInput}
          afterChangeListener={onFetchAgain}
          children={
            <SearchIcon
              style={{
                transform: `${RV_RTL ? 'rotate(0deg)' : 'rotate(90deg)'}`,
              }}
              className={'rv-distant'}
            />
          }
        />
        {/* <JustMeSaved>
          <switch />
          <Heading type={'H4'}>{'فقط آن چه من ثبت کرده ام'}</Heading>
        </JustMeSaved> */}
        <PeopleList>
          <PerfectScrollBar>
            <SimpleListViewer
              fetchMethod={fetchUsers}
              extraData={extraData}
              onEndReached={() => {
                console.log('Im reached end');
              }}
              onTotal={(total) => console.log(total, 'total found')}
              renderItem={(x, index) => (
                <PeopleItem onClick={onChoose} item={x} key={index} />
              )}
            />
          </PerfectScrollBar>
        </PeopleList>
      </PeopleBody>
    </Container>
  );
};

export default PeoplePicker;
