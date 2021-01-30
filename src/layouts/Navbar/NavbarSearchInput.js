import { useState } from 'react';
import { SearchContainer, SearchInput, SearchIcon } from './Navbar.styles';

const NavbarSearchInput = () => {
  const [isFocused, setIsFocused] = useState(false);
  const handleWidth = () => {
    setIsFocused(!isFocused);
  };
  return (
    <SearchContainer>
      <SearchIcon
        className="fa fa-search"
        aria-hidden="true"
        inFocus={isFocused}
      />
      <SearchInput
        type="search"
        placeholder={isFocused ? '' : 'جستجو در مطالب،کاربران،ابزارها و ...'}
        onFocus={handleWidth}
        onBlur={handleWidth}
        inFocus={isFocused}
      />
    </SearchContainer>
  );
};

export default NavbarSearchInput;
