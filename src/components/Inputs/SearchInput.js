import React from 'react';
import styled from 'styled-components';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import RxInput from './RxInput';

const InputWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3rem;
  border: 0.03rem solid var(--rv-color-distant);
  border-radius: 0.625rem;
  max-width: 42rem;
  width: 100%;
  padding: 0.75rem;
  background-color: var(--rv-white-color);
`;

const CustomInput = styled(RxInput).attrs({
  type: 'text',
})`
  outline: none;
  border: none;
  background-color: transparent;
  height: 3rem;
  width: 100%;

  &::placeholder {
    color: var(--rv-color-distant);
    font-size: 0.875rem;
  }
`;

const SearchInput = React.forwardRef((props, ref) => {
  return (
    <InputWrapper>
      <CustomInput {...props} ref={ref} />
      <SearchIcon size={23} className={'rv-distant'} />
    </InputWrapper>
  );
});
SearchInput.displayName = 'SearchInput';
export default SearchInput;
