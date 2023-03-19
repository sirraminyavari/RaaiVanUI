import { SearchSvg } from '@cliqmind/rv-components';
import React from 'react';
import RxInput from './RxInput';

const SearchInput = React.forwardRef((props, ref) => {
  return (
    <>
      <RxInput {...props} Icon={SearchSvg} ref={ref} />
    </>
  );
});
SearchInput.displayName = 'SearchInput';
export default SearchInput;
