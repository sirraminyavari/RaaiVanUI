/**
 * A component for advanced searching
 */
import FilterBar from 'components/AdvancedSearch/items/FilterBar/FilterBar';
import FormFilter from 'components/FormElements/FormFilter/FormFilter';
import React, { useEffect, useState } from 'react';
import {
  Container,
  Maintainer,
  SideFilter,
  Space,
  TopFilter,
  Scrollable,
  ScrollProvider,
  AdvancedFilterDialog,
} from './AdvancedSearch.style';
import UrgentCreate from './items/UrgentCreate';
import ScrollBarProvider from 'components/ScrollBarProvider/ScrollBarProvider';
import { advancedSearchButtonRef } from 'components/AdvancedSearch/items/FilterBar/FilterBar';
import APIHandler from 'apiHelper/APIHandler';
import RelatedTopicsTab from 'components/RelatedTopicsTab/RelatedTopicsTab';

const { RVDic, RVGlobal } = window;
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
  isProfile,
  onApplyNodeType,
  relatedNodeID,
  ...props
}) => {
  const getNodeInfoAPI = new APIHandler('CNAPI', 'GetRelatedNodesAbstract');

  const { offsetTop, offsetLeft } = advancedSearchButtonRef?.current || {};

  const nodeTypeId = relatedNodeID || nodeType?.NodeTypeID;
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
  const [isBookMarked, setIsBookMarked] = useState(null);

  const [isByMe, setIsByMe] = useState(false);
  const [byPeople, setByPeople] = useState([]);

  const [relatedNodes, setRelatedNodes] = useState([]);

  useEffect(() => {
    if (isProfile) getRelatedNodes();
  }, []);

  useEffect(() => setIsBookMarked(bookmarked === true), [bookmarked]);

  useEffect(() => {
    const { offsetTop } = advancedSearchButtonRef?.current || {};
  }, [advancedSearchButtonRef?.current]);

  // Creates object with 'JSONValue' param of formElements
  const normalizeSearchElements = (value) => {
    let temp = {};
    Object.keys(value).map((key, index) => {
      if (value[key].Type === 'form') {
        let formTemp = {};
        Object?.keys(value[key]?.JSONValue)?.map((miniKey, index) => {
          if (value[key]?.JSONValue[miniKey]?.JSONValue)
            formTemp = {
              [miniKey]: value[key]?.JSONValue[miniKey]?.JSONValue,
              ...formTemp,
            };
          return null;
        });

        if (Object.keys(formTemp).length) temp = { [key]: formTemp, ...temp };
      } else if (value[key].Type === 'date') {
        if (value[key]?.JSONValue) {
          temp = { [key]: value[key]?.JSONValue, ...temp };
        }
      } else {
        if (value[key]?.JSONValue) {
          temp = { [key]: value[key]?.JSONValue, ...temp };
        }
      }
      setFormFilters(JSON.parse(JSON.stringify(temp)));
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
    if (item) {
      setIsByMe(false);

      const isSelectedBefore = byPeople?.find((x) => x.id === item?.id);

      setByPeople(
        !!isSelectedBefore
          ? byPeople.filter((x) => x.id !== item.id)
          : [...byPeople, item]
      );
    } else {
      setByPeople([]);
    }
  };

  const getRelatedNodes = () => {
    getNodeInfoAPI.fetch(
      {
        NodeID: relatedNodeID || RVGlobal?.CurrentUser?.UserID,
        In: true,
        Out: true,
        InTags: true,
        OutTags: true,
        ParseResults: true,
      },
      (response) => {
        if (response && response.NodeTypes) setRelatedNodes(response);
      }
    );
  };

  return (
    <Container
      isAdvancedShow={isAdvancedSearch}
      // className={'rv-bg-color-white'}
      itemSelectionMode={itemSelectionMode}
      RV_RTL={RV_RTL}
    >
      <ScrollProvider
        className={`${
          itemSelectionMode ? '' : 'rv-bg-color-light-gray'
        } rv-border-radius-half`}
        itemSelectionMode={itemSelectionMode}
        isAdvancedShow={!itemSelectionMode && isAdvancedSearch}
      >
        <ScrollBarProvider
          containerRef={(ref) => {
            if (ref) {
              ref._getBoundingClientRect = ref.getBoundingClientRect;

              ref.getBoundingClientRect = () => {
                const original = ref._getBoundingClientRect();

                return {
                  ...original,
                  // height: Math.round(original.height)
                };
              };
            }
          }}
          className={'rv-border-radius-half'}
        >
          <Scrollable isAdvancedShow={isAdvancedSearch}>
            <Maintainer
              itemSelectionMode={itemSelectionMode}
              isAdvancedShow={isAdvancedSearch}
              className={`${
                itemSelectionMode ? '' : 'rv-bg-color-light-gray'
              } rv-border-radius-half`}
              fullWidth={isAdvancedSearch}
            >
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
                  bookmarked={bookmarked}
                  isProfile={isProfile}
                  withRelatedNodes={Boolean(relatedNodeID)}
                />
              </TopFilter>
              <div
                data-tut={'advanced_search_results'}
                style={{
                  padding: '0 2rem 2rem 2rem',
                }}
                {...props}
              >
                {(isProfile || relatedNodeID) && (
                  <RelatedTopicsTab
                    provideNodes={onApplyNodeType && onApplyNodeType}
                    relatedNodes={relatedNodes}
                    defaultChecked={isProfile}
                    showAll
                  />
                )}

                <UrgentCreate
                  onDismiss={onCreateUrgent}
                  hierarchy={hierarchy}
                  isVisible={urgentCreate}
                  nodeTypeId={nodeTypeId}
                  onForceFetch={forceFetch}
                  dataFetched={totalFound}
                  nodeType={nodeType}
                  itemSelectionMode={itemSelectionMode}
                />
                {children &&
                  React.cloneElement(children, {
                    searchText: searchText,
                    dateFilter: dateFilter,
                    formFilters: formFilters,
                    forceFetch: forceReload,
                    isByMe: isProfile ? true : isByMe,
                    byPeople: byPeople,
                    isBookMarked: isBookMarked,
                    onTotalFound: setTotalFound,
                  })}
              </div>
            </Maintainer>
          </Scrollable>
        </ScrollBarProvider>
      </ScrollProvider>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          // width: '25rem',
        }}
      >
        {!itemSelectionMode && (
          <Space $isEnabled={isAdvancedSearch} dir={RV_RevFloat} rtl={RV_RTL} />
        )}
        {!itemSelectionMode && (
          <SideFilter
            $isEnabled={isAdvancedSearch && formElements}
            dir={RV_RevFloat}
            rtl={RV_RTL}
          >
            {isAdvancedSearch && formElements && (
              <FormFilter
                formName={RVDic.AdvancedFilters}
                filters={formElements}
                onFilter={normalizeSearchElements}
                onCloseFilter={() => setIsAdvancedSearch(false)}
              />
            )}
          </SideFilter>
        )}
      </div>

      {isAdvancedSearch && formElements && itemSelectionMode && (
        <AdvancedFilterDialog
          className={'rv-border-radius-half'}
          top={advancedSearchButtonRef?.current?.getBoundingClientRect()?.top}
          left={advancedSearchButtonRef?.current?.getBoundingClientRect()?.left}
        >
          <FormFilter
            formName={RVDic.AdvancedFilters}
            filters={formElements}
            onFilter={normalizeSearchElements}
            onCloseFilter={() => setIsAdvancedSearch(false)}
          />
        </AdvancedFilterDialog>
      )}
    </Container>
  );
};

AdvanceSearchDesktop.displayName = 'AdvanceSearchDesktop';
export default AdvanceSearchDesktop;
