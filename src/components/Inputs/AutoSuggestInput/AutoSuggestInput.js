import { useState, useEffect, cloneElement } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import useDebounce from 'hooks/useDebounce';
import Loader from 'components/Loader/Loader';
import Button from 'components/Buttons/Button';
import * as Styled from './AutoSuggestInput.styles';

/**
 * @typedef PropType
 * @property {number} [delay] - The delay of debouncing.
 * @property {number} [searchAt] -The minimum character is needed to api call begins.
 * @property {string} [placeholder] -The input placeholder.
 * @property {string} endpoint -The endpoint to search for suggestions.
 * @property {function} onSearchChange -The function to be called on suggestion selection.
 */

/**
 *  @description Renders an auto suggestion input.
 * @component
 * @param {PropType} props
 */
const AutoSuggestInput = (props) => {
  const {
    delay,
    searchAt,
    onSearchChange,
    placeholder,
    endpoint,
    children,
  } = props;
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasError, setHasError] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  const fetchItems = (search) => {
    fetch(`http://localhost:3004/${endpoint}?name_like=${search}`)
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

  const getHighlightedText = (text, highlight) => {
    const sanitized = highlight.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const parts = text.split(new RegExp(`(${sanitized})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => (
          <Styled.HighlightedText
            key={i}
            isMatch={part.toLowerCase() === highlight.toLowerCase()}>
            {part}
          </Styled.HighlightedText>
        ))}
      </span>
    );
  };

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
        <Styled.InputContainer
          className={`${!children && 'ColdBackgroundColor'} BorderRadius4`}>
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
              <Styled.Input
                {...getInputProps({ placeholder, className: 'BorderRadius4' })}
              />
              {isSearching && <Loader />}
            </Styled.InputElementWrapper>
          )}
          <Styled.SuggestMenu
            {...getMenuProps({
              className: 'BorderRadius4 ColdBackgroundColor SurroundingShadow',
            })}
            {...getRootProps({ refKey: 'ulRef' })}
            hasChildren={!!children}
            hasError={hasError}
            items={items}>
            <Styled.ButtonsContainer className="ColdBackgroundColor SurroundingShadow">
              <Button type="primary">Click me</Button>
              <Button type="negative">Click me</Button>
            </Styled.ButtonsContainer>
            <Styled.ListItemsContainer hasError={hasError} items={items}>
              {isOpen &&
                inputValue &&
                items.map((item, index) => {
                  return (
                    <Styled.ListItems
                      hasError={hasError}
                      {...getItemProps({
                        key: index,
                        className: `${
                          hasError
                            ? 'ColdBackgroundColor'
                            : highlightedIndex === index
                            ? 'SoftBackgroundColor'
                            : 'ColdBackgroundColor'
                        }`,
                        index,
                        item,
                      })}>
                      {hasError && (
                        <Styled.Error className="Circle">!</Styled.Error>
                      )}
                      {getHighlightedText(item.value, searchTerm)}
                    </Styled.ListItems>
                  );
                })}
            </Styled.ListItemsContainer>
          </Styled.SuggestMenu>
        </Styled.InputContainer>
      )}
    </Downshift>
  );
};

AutoSuggestInput.propTypes = {
  delay: PropTypes.number,
  searchAt: PropTypes.number,
  onSearchChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  endpoint: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.node]),
};

AutoSuggestInput.defaultProps = {
  delay: 500,
  searchAt: 3,
  placeholder: 'جستجو ...',
};

AutoSuggestInput.displayName = 'AutoSuggestInput';

export default AutoSuggestInput;
