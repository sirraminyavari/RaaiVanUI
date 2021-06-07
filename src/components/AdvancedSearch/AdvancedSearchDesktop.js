/**
 * A component for advanced searching
 */
import FilterBar from 'components/FilterBar/FilterBar';
import FormFilter from 'components/FormElements/FormFilter/FormFilter';
import React, { useState } from 'react';
import { Component } from 'react';
import {
  Container,
  Maintainer,
  SideFilter,
  TopFilter,
} from './AdvancedSearch.style';

const { RV_RTL } = window;
/**
 *
 * @param {Component} children - the componet that renders inside AdvancedSearchComponent
 * @param {String} nodeTypeId - required for fetching node list
 */
const AdvanceSearchDesktop = ({ children, nodeTypeId }) => {
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
  return (
    <Container RV_RTL={RV_RTL}>
      <Maintainer fullWidth={isAdvancedSearch}>
        <TopFilter>
          <FilterBar
            nodeTypeId={nodeTypeId}
            advancedSearch={isAdvancedSearch}
            onAdvanecedSearch={setIsAdvancedSearch}
            onSearch={setSearchText}
            onByDate={setDateFilter}
            onFormElements={setFormElements}
          />
        </TopFilter>
        <div>
          {React.cloneElement(children, {
            searchText: searchText,
            dateFilter: dateFilter,
            formFilters: formFilters,
          })}
        </div>
      </Maintainer>
      <SideFilter isEnabled={isAdvancedSearch}>
        {isAdvancedSearch && formElements && (
          <FormFilter
            formName={'فیلتر های پیشرفته'}
            filters={formElements}
            onFilter={normalizeSearchElements}
            onCloseFilter={() => setIsAdvancedSearch(false)}
          />
        )}
      </SideFilter>
    </Container>
  );
};
export default AdvanceSearchDesktop;
