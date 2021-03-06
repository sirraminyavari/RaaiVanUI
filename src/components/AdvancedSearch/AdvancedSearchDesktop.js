/**
 * A component for advanced searching
 */
import FilterBar from 'components/FilterBar/FilterBar';
import FormFilter from 'components/FormElements/FormFilter/FormFilter';
import useWindow from 'hooks/useWindowContext';
import React, { useState } from 'react';
import {
  Container,
  Maintainer,
  SideFilter,
  Space,
  TopFilter,
  Scrollable,
  ScrollProvider,
} from './AdvancedSearch.style';
import UrgentCreate from './items/UrgentCreate';
import PerfectScrollbar from 'components/ScrollBarProvider/ScrollBarProvider';
import { useSelector } from 'react-redux';

const { RVDic } = window;
/**
 *
 * @param {Component} children - the componet that renders inside AdvancedSearchComponent
 * @param {String} nodeTypeId - required for fetching node list
 */
const AdvanceSearchDesktop = ({
  children,
  nodeType,
  hierarchy,
  bookmarked,
  itemSelectionMode,
  ...props
}) => {
  const nodeTypeId = nodeType?.NodeTypeID;
  const { RV_RTL, RV_RevFloat } = window;
  // if has a char, will find it.
  const [searchText, setSearchText] = useState('');
  // if True, filter for will apear.
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
  // obejcts of filters thet user selected.
  const [formFilters, setFormFilters] = useState({});
  // selected date on topBar component.
  const [dateFilter, setDateFilter] = useState(null);
  // formElements passed from 'FormFilter'
  const [formElements, setFormElements] = useState(null);
  // total items found
  const [totalFound, setTotalFound] = useState(null);
  // By changing 'forceReload', an useEffect in 'NodeList' will be called and forces to fetch again.
  const [forceReload, setForceReload] = useState(false);
  // if True, filters nodes created by specific people(under develop)

  const [urgentCreate, setUrgentCreate] = useState(false);

  // it may be null
  const [isBookMarked, setIsBookMarked] = useState(bookmarked === true);

  const [isByMe, setIsByMe] = useState(false);
  const [byPeople, setByPeople] = useState(null);

  const { onboardingName } = useSelector((state) => ({
    onboardingName: state.onboarding.name,
  }));
  // Creates object with 'JSONValue' param of formElements
  const normalizeSearchElements = (value) => {
    let temp = {};
    Object.keys(value).map((key, index) => {
      if (value[key].Type === 'form') {
        let formTemp = {};
        Object?.keys(value[key]?.JSONValue)?.map((miniKey, index) => {
          formTemp = {
            [miniKey]: value[key]?.JSONValue[miniKey]?.JSONValue,
            ...formTemp,
          };
          return null;
        });
        temp = { [key]: formTemp, ...temp };
        setFormFilters(temp);
      } else {
        temp = { [key]: value[key]?.JSONValue, ...temp };
        setFormFilters(temp);
      }
      return temp;
    });
  };

  // change 'forceReload' to work as a trigger in 'NodeList'
  const forceFetch = () => {
    setForceReload(!forceReload);
  };
  const onCreateUrgent = () => {
    setUrgentCreate(!urgentCreate);
  };
  const onByMe = (e) => {
    setIsByMe(e);
    if (e) {
      setByPeople(null);
    }
  };
  const onByPeople = (item) => {
    setIsByMe(false);

    setByPeople(item);
  };

  return (
    <Container
      isAdvancedShow={isAdvancedSearch}
      className={'rv-bg-color-white'}
      itemSelectionMode={itemSelectionMode}
      RV_RTL={RV_RTL}>
      <ScrollProvider
        className={'rv-bg-color-light-gray'}
        itemSelectionMode={itemSelectionMode}
        isAdvancedShow={isAdvancedSearch}>
        <PerfectScrollbar
          onYReachEnd={(event) => console.log(event, 'on end reached')}
          style={{ maxHeight: '100vh' }}
          className={'rv-border-radius-half'}>
          <Scrollable isAdvancedShow={isAdvancedSearch}>
            <Maintainer
              isAdvancedShow={isAdvancedSearch}
              className={'rv-bg-color-light-gray'}
              fullWidth={isAdvancedSearch}>
              <TopFilter>
                <FilterBar
                  nodeTypeId={nodeTypeId}
                  advancedSearch={isAdvancedSearch}
                  onAdvanecedSearch={setIsAdvancedSearch}
                  onSearch={setSearchText}
                  onByDate={setDateFilter}
                  onFormElements={setFormElements}
                  totalFound={totalFound}
                  hierarchy={hierarchy}
                  nodeType={nodeType}
                  onCreateUrgent={onCreateUrgent}
                  onForceFetch={forceFetch}
                  onByMe={onByMe}
                  onByPeople={onByPeople}
                  isByMe={isByMe}
                  people={byPeople}
                  onByBookmarked={setIsBookMarked}
                  isBookMarked={isBookMarked}
                  itemSelectionMode={itemSelectionMode}
                />
              </TopFilter>
              <div
                data-tut={'advanced_search_results'}
                style={{ padding: '0 2rem 0 2rem' }}
                {...props}>
                <UrgentCreate
                  onDismiss={onCreateUrgent}
                  hierarchy={hierarchy}
                  isVisible={urgentCreate}
                  nodeTypeId={nodeTypeId}
                  onForceFetch={forceFetch}
                  dataFetched={totalFound}
                  nodeType={nodeType}
                />

                {React.cloneElement(children, {
                  searchText: searchText,
                  dateFilter: dateFilter,
                  formFilters: formFilters,
                  forceFetch: forceReload,
                  isByMe: isByMe,
                  byPeople: byPeople,
                  isBookMarked: isBookMarked,
                  onTotalFound: setTotalFound,
                })}
              </div>
            </Maintainer>
          </Scrollable>
        </PerfectScrollbar>
      </ScrollProvider>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          // width: '25rem',
        }}>
        {!itemSelectionMode && (
          <Space $isEnabled={isAdvancedSearch} dir={RV_RevFloat} rtl={RV_RTL} />
        )}
        <SideFilter
          $isEnabled={isAdvancedSearch && formElements}
          dir={RV_RevFloat}
          rtl={RV_RTL}>
          {isAdvancedSearch && formElements && (
            <FormFilter
              formName={RVDic.AdvancedFilters}
              filters={formElements}
              onFilter={normalizeSearchElements}
              onCloseFilter={() => setIsAdvancedSearch(false)}
            />
          )}
        </SideFilter>
      </div>
    </Container>
  );
};
export default AdvanceSearchDesktop;
