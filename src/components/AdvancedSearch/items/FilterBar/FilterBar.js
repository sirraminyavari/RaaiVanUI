/**
 * A component for applying the simple search tools.
 */
import APIHandler from 'apiHelper/APIHandler';
import Breadcrumb from 'components/Breadcrumb/Breadcrumb';
import CustomDatePicker from 'components/CustomDatePicker/CustomDatePicker';
import AnimatedDropDownList from 'components/DropDownList/AnimatedDropDownList';
import Heading from 'components/Heading/Heading';
import AddIcon from 'components/Icons/AddIcon/AddIcon';
import FlashIcon from 'components/Icons/FlashIcon/FlashIcon';
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
  CLASSES_PATH,
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
import {
  BookmarkSvg,
  ButtonGroup,
  CalendarClearSvg,
  CalendarSvg,
  FlashSvg,
  FunnelSvg,
  GridSvg,
  PersonCircleSvg,
  PlusSvg,
  RVSizeProp,
} from '@cliqmind/rv-components';
import BreadcrumbLayout from 'layouts/NewSidebar/breadCrumbLayout/breadcrumbLayout';
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
    if (location.pathname !== CLASSES_PATH) {
      if (nodeType?.TypeName) return decode(nodeType?.TypeName);
      if (teamName) return teamName;
    }

    if (bookmarked) return 'Bookmarked';
    return 'EveryThing';
    // if (Draft) return 'bookmarked';
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
      <BreadcrumbLayout
        searchInputPlaceholder={RVDic?.SearchInN.replace(
          '[n]',
          RVDic?.Keywords
        )}
        Icon={() =>
          location.pathname !== CLASSES_PATH ? (
            <img
              alt={''}
              style={{
                height: '3rem',
                aspectRatio: 1,
                borderRadius: '25%',
                marginInlineEnd: '0.5rem',
              }}
              src={nodeType?.IconURL}
            />
          ) : bookmarked ? (
            <BookmarkSvg
              size="1.6rem"
              style={{
                marginInlineEnd: '0.5rem',
              }}
              outline
            />
          ) : (
            <GridSvg
              size="1.6rem"
              style={{
                marginInlineEnd: '0.5rem',
              }}
              outline
            />
          )
        }
        routeLinks={[
          {
            path: '',
            label: isProfile ? RVDic.RelatedNodes : getTypeName(),
          },
        ]}
      >
        {itemSelectionMode ? (
          location.pathname !== CLASSES_PATH && (
            <ButtonGroup>
              <Button size={RVSizeProp.small} rounded={undefined}>
                <PlusSvg style={{ marginBlock: '0.05rem' }} />
                {RVDic?.AddQuickly}
              </Button>
              <Button
                size={RVSizeProp.small}
                rounded={undefined}
                onClick={onCreateUrgent}
              >
                <FlashSvg style={{ marginBlock: '0.05rem' }} />
              </Button>
            </ButtonGroup>
          )
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
      </BreadcrumbLayout>

      <BottomRow>
        <div
          style={{
            width: '100%',
            maxWidth: '450px',
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          <SearchInput
            onChange={onTextSearch}
            delayTime={300}
            fullWidth
            placeholder={RVDic?.SearchInN.replace('[n]', RVDic?.Keywords)}
          />
          {!_.isNull(totalFound) && (
            <Heading
              style={{
                whiteSpace: 'nowrap',
              }}
              type={'h6'}
            >
              {RVDic?.NItems?.replace('[n]', totalFound)}
            </Heading>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '.5rem',
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
                tipId="filterbar-footer-created-date"
                // offset={{ [RV_Float]: -16 }}
                place={'top'}
                effect="solid"
                renderContent={() => (
                  <span style={{ textTransform: 'capitalize' }}>
                    Created date
                  </span>
                )}
              >
                <ShadowButton
                  onClick={() => {
                    onClick();
                  }}
                  active={date || calendarPickerClicked}
                  fullCircle
                  size={RVSizeProp.medium}
                  rounded="half"
                >
                  {date ? (
                    <CalendarSvg outline={calendarPickerClicked || dateHover} />
                  ) : (
                    <CalendarClearSvg
                      outline={calendarPickerClicked || dateHover}
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
              tipId="filterbar-footer-bookmarked"
              // offset={{ [RV_Float]: -16 }}
              place={'top'}
              effect="solid"
              renderContent={() => (
                <span style={{ textTransform: 'capitalize' }}>
                  Show bookmarked only
                </span>
              )}
            >
              <ShadowButton
                onClick={() => push(`?bookmarked=${isBookMarked ? 0 : 1}`)}
                active={isBookMarked}
                size={RVSizeProp.medium}
                rounded="half"
                fullCircle
              >
                <BookmarkSvg outline={!isBookMarked} />
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
                  tipId="filterbar-footer-created-by"
                  // offset={{ [RV_Float]: -16 }}
                  place={'top'}
                  effect="solid"
                  renderContent={() => (
                    <span style={{ textTransform: 'capitalize' }}>
                      Created by
                    </span>
                  )}
                >
                  <ShadowButton
                    onClick={() => setPeoplePickerVisibility((prev) => !prev)}
                    active={
                      (people || []).length || isByMe || peoplePickerVisibility
                    }
                    size={RVSizeProp.medium}
                    rounded="half"
                    fullCircle
                  >
                    <PersonCircleSvg
                      outline={
                        (people || []).length ||
                        isByMe ||
                        peoplePickerVisibility
                      }
                    />
                  </ShadowButton>
                </Tooltip>
              }
            />
          )}
          {(advancedButton || isProfile_all()) && (
            <ShadowButton
              // style={{
              //   color:
              //     advancedSearch || filterHover ? 'rv-default' : 'rv-distant',
              // }}
              ref={advancedSearchButtonRef}
              onMouseEnter={() => setFilterHover(true)}
              onMouseLeave={() => setFilterHover(false)}
              onClick={onAdvancedFilterClick}
              active={advancedSearch}
              size={RVSizeProp.medium}
              rounded="half"
            >
              <FunnelSvg active={advancedSearch} />
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
