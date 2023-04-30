import { SearchSvg } from '@cliqmind/rv-components';
import React from 'react';
import RxInput, { RxInputType } from './RxInput';

const SearchInput = React.forwardRef<HTMLInputElement, RxInputType>(
  (props, ref) => {
    return (
      <>
        <RxInput {...props} Icon={SearchSvg} ref={ref} />
      </>
    );
  }
);
SearchInput.displayName = 'SearchInput';
export default SearchInput;
