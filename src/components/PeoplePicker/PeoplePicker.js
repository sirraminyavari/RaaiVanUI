import APIHandler from 'apiHelper/APIHandler';
import Heading from 'components/Heading/Heading';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import UndoIcon from 'components/Icons/UndoIcon/Undo';
import LogoLoader from 'components/Loaders/LogoLoader/LogoLoader';
import ScrollBarProvider from 'components/ScrollBarProvider/ScrollBarProvider';
import SimpleListViewer from 'components/SimpleListViewer/SimpleListViewer';
import Toggle from 'components/Buttons/Toggle/Toggle';
import { C_DISTANT } from 'constant/Colors';
import { CV_DISTANT, CV_FREEZED, CV_RED } from 'constant/CssVariables';
import { decodeBase64, encodeBase64 } from 'helpers/helpers';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import PeopleItem from './PeopleItem';
import {
  Container,
  JustMeSaved,
  PeopleBody,
  PeopleList,
  ResetContainer,
  SearchInput,
} from './PepolePicker.style';

const { RVDic, RV_RTL } = window;

const getUsersAPI = new APIHandler('UsersAPI', 'GetUsers');

const PeoplePicker = ({
  buttonComponent,
  onByMe,
  onByPeople,
  isByMe = false,
  pickedPeople,
  multi,
  onBlur,
  direction = 'top',
  fixedPositioning = false,

  onVisible,
}) => {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [extraData, setExtraData] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [buttonBoundingRect, setButtonBoundingRect] = useState(undefined);

  const buttonRef = useRef();
  const pickerRef = useRef();
  useEffect(() => {
    onVisible(isPickerVisible);
  }, [isPickerVisible]);
  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        // onClick();

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
    // fetchUsers();
    setExtraData(!extraData);
  }, []);

  const onChoose = (item) => {
    onByPeople && onByPeople(item);
    if (!multi) {
      setPickerVisible(false);
    }
  };

  const onPicker = () => {
    setPickerVisible(!isPickerVisible);
  };

  const ClonedButtonComponent = React.cloneElement(buttonComponent, {
    onClick: onPicker,
    ref: buttonRef,
  });

  const fetchUsers = (count = 20, lowerBoundary = 1, done) => {
    getUsersAPI.fetch(
      {
        SearchText: encodeBase64(searchInput),
        Count: count,
        LowerBoundary: lowerBoundary,
      },
      (response) => {
        const users = response.Users.map((user) => ({
          id: user?.UserID,
          name: decodeBase64(user?.FullName),
          avatarUrl: user?.ImageURL,
        }));
        //   resolve(users);
        if (done) {
          done(users);
        }
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

  const onInput = (event) => {
    setSearchInput(event?.target?.value);
  };
  const onByMeSelect = (e) => {
    console.log(e, 'eeee');
    onByMe(e);
    setPickerVisible(false);
  };
  const setButtonBoundingRectOnScroll = () => {
    setButtonBoundingRect(buttonRef.current?.getBoundingClientRect());
  };

  useEffect(() => {
    setButtonBoundingRectOnScroll();
    window.addEventListener('scroll', setButtonBoundingRectOnScroll);
    return () => {
      window.removeEventListener('scroll', setButtonBoundingRectOnScroll);
    };
  }, []);

  return (
    <Container ref={pickerRef}>
      {/* {buttonComponent} */}
      {isFetching && isPickerVisible ? <LogoLoader /> : ClonedButtonComponent}

      <PeopleBody
        Direction={direction}
        className={'rv-bg-color-white rv-border-radius-half'}
        isVisible={isPickerVisible}
        triggerButtonRect={fixedPositioning && buttonBoundingRect}
        // onScrollCapture={() => alert('sad')}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Close onClick={() => setPickerVisible(false)} />

          <ResetContainer onClick={() => onChoose(null)}>
            <Heading cursor={'pointer'} type={'H6'}>
              {RVDic.Reset}
            </Heading>
            <UndoIcon
              style={{
                cursor: 'pointer',
                transform: 'scaleX(-1)',
                marginRight: '1rem',
              }}
              className={C_DISTANT}
              size={16}
            />
          </ResetContainer>
        </div>
        <SearchInput
          placeholder={RVDic.SearchUsers}
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
        <JustMeSaved>
          <Toggle
            isChecked={isByMe}
            onToggle={onByMeSelect}
            titleClass={'rv-warm'}
            title={RVDic.Myself}
            titleStyle={{ fontSize: '0.8rem' }}
          />
        </JustMeSaved>
        <PeopleList>
          <ScrollBarProvider>
            <SimpleListViewer
              fetchMethod={fetchUsers}
              extraData={extraData}
              onEndReached={() => {
                console.log('Im reached end');
              }}
              onTotal={(total) => {}}
              renderItem={(x, index) => {
                return (
                  <PeopleItem
                    pickedPeople={
                      multi
                        ? pickedPeople?.find((y) => y.id === x.id)
                        : pickedPeople?.id === x.id
                    }
                    onClick={onChoose}
                    item={x}
                    key={index}
                  />
                );
              }}
            />
          </ScrollBarProvider>
        </PeopleList>
      </PeopleBody>
    </Container>
  );
};

export default PeoplePicker;

const Close = styled(CloseIcon)`
  color: ${CV_FREEZED};
  :hover {
    color: ${CV_RED};
  }
`;
