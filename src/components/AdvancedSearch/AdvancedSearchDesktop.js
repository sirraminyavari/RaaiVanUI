/**
 * A component for advanced searching
 */
import { useState, Component, cloneElement } from 'react';
import FilterBar from 'components/FilterBar/FilterBar';
import FormFilter from 'components/FormElements/FormFilter/FormFilter';
import useWindow from 'hooks/useWindowContext';
import {
  Container,
  Maintainer,
  SideFilter,
  TopFilter,
} from './AdvancedSearch.style';

/**
 *
 * @param {Component} children - the componet that renders inside AdvancedSearchComponent
 * @param {String} nodeTypeId - required for fetching node list
 */
const AdvanceSearchDesktop = ({ children, nodeTypeId, hierarchy }) => {
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

  const [totalFound, setTotalFound] = useState(null);

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
    <Container className={'rv-bg-color-white'} RV_RTL={RV_RTL}>
      {console.log(hierarchy, 'hierarchy*')}
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
          />
        </TopFilter>
        <div style={{ paddingRight: '2rem', paddingLeft: '2rem' }}>
          {cloneElement(children, {
            searchText: searchText,
            dateFilter: dateFilter,
            formFilters: formFilters,
            onTotalFound: setTotalFound,
          })}
        </div>
      </Maintainer>
      {isAdvancedSearch && formElements && (
        <SideFilter dir={RV_RevFloat} rtl={RV_RTL}>
          <FormFilter
            formName="فیلتر های پیشرفته"
            filters={formElements}
            onFilter={normalizeSearchElements}
            onCloseFilter={() => setIsAdvancedSearch(false)}
          />
        </SideFilter>
      )}
    </Container>
  );
};
export default AdvanceSearchDesktop;
