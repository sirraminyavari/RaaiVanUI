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
import SearchInput from 'components/Inputs/SearchInput';
import PeoplePicker from 'components/PeoplePicker/PeoplePicker';
import { decodeBase64 } from 'helpers/helpers';
import { decode } from 'js-base64';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { BackButton, BottomRow, Container, TopRow } from './FilterBar.style';
import { CV_RED, CV_WHITE } from 'constant/CssVariables';
import {
  INTRO_ONBOARD,
  USER_MORE_RELATED_TOPICS_PATH,
  USER_WITHID_PATH,
} from 'constant/constants';
import Button from 'components/Buttons/Button';
import ShadowButton from 'components/Buttons/ShadowButton';
import { selectTheme } from 'store/slice/theme/selectors';
import { selectOnboarding } from 'store/slice/onboarding/selectors';
import { getNewNodePageUrl } from 'apiHelper/getPageUrl';
import NodePageRelatedNodeItems from 'views/Node/nodeDetails/items/topBar/NodePageRelatedNodeItems';
import Tooltip from 'components/Tooltip/react-tooltip/Tooltip';

export const advancedSearchButtonRef = React.createRef();

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
  bookmarked,
  itemSelectionMode,
  isProfile,
  withRelatedNodes,
}) => {
  const { selectedTeam: selectedApp } = useSelector(selectTheme);
  const teamName = selectedApp.name;
  const { name: onboardingName } = useSelector(selectOnboarding);

  const defaultDropDownLabel = {
    icon: <AddIcon className={'rv-default'} style={{ fontSize: '1.2rem' }} />,
    label: RVDic?.NewN?.replace(
      '[n]',
      !_.isEmpty(hierarchy) ? decode(hierarchy[0]?.TypeName) : ''
    ),
    value: null,
    color: 'white',
  };

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

  const [peoplePickerVisibility, setPeoplePickerVisibility] = useState(false);
  const [calendarPickerClicked, setCalendarPickerClicked] = useState(false);
  const [isInOnBoarding, setIsInOnBoarding] = useState(false);

  const { goBack, push, location } = useHistory();
  const RelatedID = new URLSearchParams(location.search).get('RelatedID');

  // const isInOnBoarding = onboardingName === INTRO_ONBOARD;
  // const isInOnBoarding = true;
  // const isNewDocOpened = newDocMenu === OPENED;
  const isNewDocOpened = true;
  // const isInOnBoarding = false;

  /**
   * Gets user access for creating document.
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
    if (onboardingName === INTRO_ONBOARD) {
      setIsInOnBoarding(true);
      setMarket(data);
    } else getCreationAccess();
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
        push(getNewNodePageUrl(nodeTypeId));
        // SubmitNewNode(nodeTypeId);
        // window.open(RVAPI.NewNodePageURL({ NodeTypeID: nodeTypeId }));
      } else if (item?.value === 'urgentAction') {
        // setUrgentModalOpen(true);
        onCreateUrgent();
      }
    } else {
      // SubmitNewNode(nodeTypeId);
      push(getNewNodePageUrl(nodeTypeId));
    }
  };

  // By typing in the search input will fire
  const onTextSearch = (value) => {
    onSearch(value.target.value);
  };

  const onAdvancedFilterClick = () => {
    setTimeout(() => {
      onAdvanecedSearch(!advancedSearch);
    }, 0);
  };

  const onPeople = (item) => {
    onByPeople(item);
  };

  const extendedHierarchy = hierarchy?.map((level) => ({
    id: level?.NodeTypeID,
    title: decodeBase64(level?.TypeName),
    linkTo: `/classes/${level?.NodeTypeID}`,
  }));

  const breadcrumbItems = isProfile
    ? [
        { id: 1, title: RVDic.Profile, linkTo: USER_WITHID_PATH },
        {
          id: 2,
          title: RVDic.RelatedNodes,
          linkTo: USER_MORE_RELATED_TOPICS_PATH,
        },
      ]
    : [
        { id: selectedApp?.id, title: teamName, linkTo: '/classes' },
        ...extendedHierarchy,

        ...(Boolean(RelatedID)
          ? [
              {
                id: 4,
                title: RVDic.RelatedNodes,
              },
            ]
          : []),
      ];

  const hasSelectedNodeType = () => !!nodeTypeId || !!nodeType?.NodeTypeID;

  //for now, it is not necessary to show advanced options in profile mode
  const isProfile_all = () => false; // (isProfile && !hasSelectedNodeType()) || !!isProfile;

  return (
    <Container>
      {!itemSelectionMode && <Breadcrumb items={breadcrumbItems} />}
      <TopRow>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: '1.5rem',
          }}
        >
          {nodeType?.IconURL && (
            <img
              alt={''}
              style={{
                height: '3rem',
                aspectRatio: 1,
                borderRadius: '100%',
                marginInlineEnd: '0.5rem',
              }}
              src={nodeType?.IconURL}
            />
          )}
          <Heading style={{ marginBlock: '0rem' }} type={'h1'}>
            {isProfile ? RVDic.RelatedNodes : getTypeName()}
          </Heading>
          {!_.isNull(totalFound) && (
            <Heading
              style={{ marginBlockEnd: '1rem', marginInlineStart: '1rem' }}
              type={'h6'}
            >
              {RVDic?.NItems?.replace('[n]', totalFound)}
            </Heading>
          )}
        </div>
        {isProfile && (
          <BackButton
            className={'rv-border-radius-half'}
            onClick={() => goBack()}
            style={{ color: CV_RED, padding: '0.5rem' }}
            type={'secondary-o'}
          >
            {RVDic.Return}
          </BackButton>
        )}

        {/* Don't forget to add this for urgent create in itemSelection mode
          && market?.length > 0
          */}

        {itemSelectionMode ? (
          <Button onClick={onCreateUrgent} type={'primary'}>
            <FlashIcon className={'rv-white'} style={{ fontSize: '1.2rem' }} />
            <div style={{ margin: '0 1rem 0 1rem' }}>{RVDic?.AddQuickly}</div>
          </Button>
        ) : (
          <>
            {!isProfile && !RelatedID && (
              <div data-tut={'new_doc_menu'}>
                {market?.length > 0 && (
                  <AnimatedDropDownList
                    data={market}
                    onSelectItem={onSelectItem}
                    defaultValue={selectedItem}
                    hiddenSelectedItem={false}
                    introMode={isInOnBoarding && isNewDocOpened}
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
                            RV_RTL
                              ? 'rv-ignore-right-radius'
                              : 'rv-ignore-left-radius'
                          }`
                        : `rv-bg-color-default rv-border-radius-half ${
                            RV_RTL
                              ? 'rv-ignore-right-radius'
                              : 'rv-ignore-left-radius'
                          }`,
                      arrowIconColorClass: 'rv-white',
                    }}
                    onDropDownOpen={setIsDropDownOpen}
                  />
                )}
              </div>
            )}
          </>
        )}
      </TopRow>

      <BottomRow>
        <SearchInput
          onChange={onTextSearch}
          delayTime={300}
          style={{ maxWidth: '60%' }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginInlineStart: '1rem',
          }}
        >
          <CustomDatePicker
            label={RVDic?.SelectDate}
            mode="button"
            // type="jalali"
            hasFooter
            range
            headerTitle="فیلتر تاریخ ایجاد"
            onChangeVisibility={setCalendarPickerClicked}
            CustomButton={({ onClick }) => (
              <Tooltip
                tipId={RVDic?.CreationDate}
                effect="solid"
                place="top"
                renderContent={() => RVDic?.CreationDate}
              >
                <ShadowButton
                  onClick={() => {
                    onClick();
                  }}
                  onMouseEnter={() => setDateHover(true)}
                  onMouseLeave={() => setDateHover(false)}
                  style={commonStyle}
                  $isEnabled={date || calendarPickerClicked}
                  className={
                    calendarPickerClicked || date
                      ? 'rv-border-distant rv-default'
                      : 'rv-border-white rv-distant'
                  }
                >
                  {date ? (
                    <FilledCalendarIcon
                      size={'1.5rem'}
                      className={'rv-default'}
                    />
                  ) : (
                    <EmptyCalendarIcon
                      size={'1.5rem'}
                      className={
                        calendarPickerClicked || dateHover
                          ? 'rv-default'
                          : 'rv-distant'
                      }
                    />
                  )}
                </ShadowButton>
              </Tooltip>
            )}
            onDateSelect={(value) => {
              setDate(value);
              onByDate(value);
            }}
          />

          {!isProfile && !RelatedID && (
            <Tooltip
              tipId={RVDic?.BookmarkedSubjects}
              effect="solid"
              place="top"
              renderContent={() => RVDic?.BookmarkedSubjects}
            >
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
                }
              >
                {isBookMarked ? (
                  <FilledBookmarkIcon
                    size={'1.5rem'}
                    className={'rv-default'}
                  />
                ) : (
                  <OutLineBookmarkIcon
                    size={'1.5rem'}
                    className={bookmarkHover ? 'rv-default' : 'rv-distant'}
                  />
                )}
              </ShadowButton>
            </Tooltip>
          )}
          {!isProfile && (
            <PeoplePicker
              onByMe={onByMe}
              onByPeople={onPeople}
              multi={true}
              isByMe={isByMe}
              pickedPeople={people}
              onVisible={setPeoplePickerVisibility}
              buttonComponent={
                <Tooltip
                  tipId={RVDic?.Creator}
                  effect="solid"
                  place="top"
                  renderContent={() => RVDic?.Creator}
                >
                  <ShadowButton
                    style={commonStyle}
                    // onClick={onClick}
                    onMouseEnter={() => setPeopleHover(true)}
                    onMouseLeave={() => setPeopleHover(false)}
                    $isEnabled={
                      (people || []).length || isByMe || peoplePickerVisibility
                    }
                    className={
                      isByMe || (people || []).length || peoplePickerVisibility
                        ? 'rv-border-distant rv-default'
                        : 'rv-border-white rv-distant'
                    }
                  >
                    <PersonIcon
                      size={'1.5rem'}
                      className={
                        isByMe ||
                        (people || []).length ||
                        peoplePickerVisibility
                          ? 'rv-default'
                          : peopleHover
                          ? 'rv-default'
                          : 'rv-distant'
                      }
                    />
                  </ShadowButton>
                </Tooltip>
              }
            />
          )}
          {(advancedButton || isProfile_all()) && (
            <ShadowButton
              style={{
                marginRight: '0.5rem',
                minWidth: '7rem',
                color:
                  advancedSearch || filterHover ? 'rv-default' : 'rv-distant',
              }}
              ref={advancedSearchButtonRef}
              onMouseEnter={() => setFilterHover(true)}
              onMouseLeave={() => setFilterHover(false)}
              onClick={onAdvancedFilterClick}
              $isEnabled={advancedSearch}
              className={
                advancedSearch
                  ? 'rv-border-distant rv-default'
                  : 'rv-border-white rv-distant'
              }
            >
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
      {RelatedID ? (
        <div style={{ width: '100%', paddingBlock: '0.5rem' }}>
          <NodePageRelatedNodeItems
            noTitle
            ClassID={nodeTypeId}
            NodeID={RelatedID}
          />
        </div>
      ) : null}
    </Container>
  );
};
export default FilterBar;

const commonStyle = { width: '3rem', aspectRatio: '1', marginRight: '0.5rem' };
