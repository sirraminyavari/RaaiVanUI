/**
 * A component for advanced searching
 */
import React, { useState, Component, cloneElement, useEffect } from 'react';
import FilterBar from 'components/FilterBar/FilterBar';
import FormFilter from 'components/FormElements/FormFilter/FormFilter';
import useWindow from 'hooks/useWindowContext';
import {
  Container,
  Maintainer,
  SideFilter,
  TopFilter,
  Space,
  UrgentInput,
} from './AdvancedSearch.style';
import SubjectItem from 'components/SubjectItem/screen/SubjectItem';
import AnimatedInput from 'components/Inputs/AnimatedInput';
import Button from 'components/Buttons/Button';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import UrgentCreate from './items/UrgentCreate';

const { RVDic } = window;
/**
 *
 * @param {Component} children - the componet that renders inside AdvancedSearchComponent
 * @param {String} nodeTypeId - required for fetching node list
 */
const AdvanceSearchDesktop = ({ children, nodeType, hierarchy }) => {
  console.log(nodeType, 'nodeType');
  const nodeTypeId = nodeType?.NodeTypeID;
  const { RV_RTL, RV_RevFloat } = useWindow();
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

  const [urgentCreate, setUrgentCreate] = useState(false);

  const [isByMe, setIsByMe] = useState(false);
  const [byPeople, setByPeople] = useState(null);

  // Creates object with 'JSONValue' param of formElements
  const normalizeSearchElements = (value) => {
    let temp = {};
    Object.keys(value).map((key, index) => {
      if (value[key].Type === 'form') {
        let formTemp = {};
        Object.keys(value[key].JSONValue).map((miniKey, index) => {
          formTemp = {
            [miniKey]: value[key].JSONValue[miniKey].JSONValue,
            ...formTemp,
          };
        });
        temp = { [key]: formTemp, ...temp };
        setFormFilters(temp);
      } else {
        temp = { [key]: value[key].JSONValue, ...temp };
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
  const onByMe = () => {
    setIsByMe(!isByMe);
  };
  const onByPeople = (item) => {
    console.log(item, 'on by people');
    setIsByMe(false);

    setByPeople(item);
  };
  return (
    <Container className={'rv-bg-color-white'} RV_RTL={RV_RTL}>
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
          />
        </TopFilter>
        <div style={{ padding: '0 2rem 0 2rem' }}>
          <UrgentCreate
            onDismiss={onCreateUrgent}
            hierarchy={hierarchy}
            isVisible={urgentCreate}
            nodeTypeId={nodeTypeId}
            onForceFetch={forceFetch}
            dataFetched={totalFound}
            nodeType={nodeType}
          />
          {console.log(totalFound, 'totlFound')}

          {React.cloneElement(children, {
            searchText: searchText,
            dateFilter: dateFilter,
            formFilters: formFilters,
            forceFetch: forceReload,
            isByMe: isByMe,
            byPeople: byPeople,
            onTotalFound: setTotalFound,
          })}
        </div>
      </Maintainer>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          // width: '25rem',
        }}>
        <Space $isEnabled={isAdvancedSearch} dir={RV_RevFloat} rtl={RV_RTL} />
        <SideFilter
          $isEnabled={isAdvancedSearch && formElements}
          dir={RV_RevFloat}
          rtl={RV_RTL}>
          {isAdvancedSearch && formElements && (
            <FormFilter
              formName="$فیلترهای پیشرفته"
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
