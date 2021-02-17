import { useState, useEffect, cloneElement } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import useDebounce from 'hooks/useDebounce';
import Loader from 'components/Loader/Loader';
import * as Styled from './AutoSuggestInput.styles';

/**
 * Renders an auto suggestion input.
 * @component
 * @param props
 */
const AutoSuggestInput = (props) => {
  const { delay, searchAt, onSearchChange, placeholder, children } = props;
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasError, setHasError] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  const fetchItems = (search) => {
    fetch(`http://localhost:3004/names?name_like=${search}`)
      .then((response) => response.json())
      .then((data) => {
        setHasError(false);
        setTimeout(() => {
          setIsSearching(false);
        }, 500);
        if (data.length === 0) {
          setHasError(true);
          setItems([{ value: 'موردی یافت نشد!' }]);
        } else {
          setItems(data.map((item) => ({ value: item.name })));
        }
      })
      .catch((error) => {
        setTimeout(() => {
          setIsSearching(false);
          setHasError(true);
          setItems([{ value: 'خطا در برقراری ارتباط' }]);
        }, 2000);
      });
  };

  const handleReducer = (state, changes) => {
    if (!state.isOpen && state.selectedItem) {
      state.selectedItem.value = '';
      return changes;
    }

    return changes;
  };

  const handleChange = (selection) => {
    onSearchChange && selection && onSearchChange(selection.value);
  };

  const handleSelection = (selectedItem, stateAndHelpers) => {
    if (!selectedItem) return;
    if (hasError) {
      stateAndHelpers.clearSelection();
      return;
    }
  };

  const handleToString = (item) => (item ? item.value : '');

  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length >= searchAt) {
      setIsSearching(true);
      fetchItems(debouncedSearchTerm);
    } else {
      setItems([]);
    }
  }, [debouncedSearchTerm]);

  return (
    <Downshift
      stateReducer={handleReducer}
      onInputValueChange={setSearchTerm}
      onChange={handleChange}
      onSelect={handleSelection}
      itemToString={handleToString}>
      {({
        getRootProps,
        getInputProps,
        getItemProps,
        getMenuProps,
        isOpen,
        inputValue,
        highlightedIndex,
      }) => (
        <Styled.InputContainer hasChildren={!!children}>
          {children ? (
            <Styled.ComponentWrapper
              {...getRootProps({ refKey: 'componentRef' })}>
              {cloneElement(children, { ...getInputProps({ placeholder }) })}
              <Styled.LoaderWrapper>
                {isSearching && <Loader />}
              </Styled.LoaderWrapper>
            </Styled.ComponentWrapper>
          ) : (
            <Styled.InputElementWrapper
              {...getRootProps({ refKey: 'inputwrapperRef' })}>
              <Styled.Input {...getInputProps({ placeholder })} />
              {isSearching && <Loader />}
            </Styled.InputElementWrapper>
          )}
          <Styled.List
            {...getMenuProps()}
            {...getRootProps({ refKey: 'ulRef' })}
            items={items}>
            {isOpen &&
              inputValue &&
              items.map((item, index) => {
                return (
                  <Styled.ListItems
                    hasError={hasError}
                    highlightedIndex={highlightedIndex}
                    index={index}
                    {...getItemProps({
                      key: item.value,
                      index,
                      item,
                    })}>
                    {hasError && <Styled.Error>!</Styled.Error>}
                    {item.value}
                  </Styled.ListItems>
                );
              })}
          </Styled.List>
        </Styled.InputContainer>
      )}
    </Downshift>
  );
};

AutoSuggestInput.propTypes = {
  /**
   * @param {number} props.delay - The delay of debouncing.
   */
  delay: PropTypes.number,
  /**
   * @param {number} props.searchAt -The minimum character is needed to api call begins.
   */
  searchAt: PropTypes.number,
  /**
   * @param {function} props.onSearchChange -The function to be called on suggestion selection.
   */
  onSearchChange: PropTypes.func,
  /**
   * @param {string} props.placeholder -The input placeholder.
   */
  placeholder: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.node]),
};

AutoSuggestInput.defaultProps = {
  delay: 500,
  searchAt: 3,
  placeholder: 'جستجو ...',
};

export default AutoSuggestInput;
