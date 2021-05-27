import FilterBar from 'components/FilterBar/FilterBar';
import React, { useState } from 'react';
import {
  Container,
  Maintainer,
  SideFilter,
  TopFilter,
} from './AdvanceSearch.style';

const AdvanceSearchDesktop = ({ children, NodeId }) => {
  console.log('desktop is loading', children);
  const [searchText, setSearchText] = useState('');
  const [advancedSearch, setAdvancedSearch] = useState(false);
  const [dateFilter, setDateFilter] = useState(null);
  return (
    <Container>
      <Maintainer fullWidth={advancedSearch}>
        <TopFilter>
          <FilterBar
            NodeId={NodeId}
            advancedSearch={advancedSearch}
            onAdvanecedSearch={setAdvancedSearch}
            onSearch={setSearchText}
            onByDate={setDateFilter}
          />
        </TopFilter>
        <div>
          {React.cloneElement(children, {
            searchText: searchText,
            dateFilter: dateFilter,
          })}
        </div>
      </Maintainer>
      <SideFilter isEnabled={advancedSearch} />
    </Container>
  );
};
export default AdvanceSearchDesktop;
