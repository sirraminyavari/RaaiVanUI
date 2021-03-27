import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import useDebounce from 'hooks/useDebounce';
import LoadingIcon from 'components/Icons/LoadingIcons/LoadingIconFlat';
import Button from 'components/Buttons/Button';
import Input from 'components/Inputs/Input';
import DotsIcon from 'components/Icons/Dots/Dots';
import * as Styled from './AutoSuggestInput.styles';

/**
 * @typedef PropType
 * @property {number} [delay] - The delay of debouncing.
 * @property {number} [searchAt] -The minimum character is needed to api call begins.
 * @property {string} [placeholder] -The input placeholder.
 * @property {function} onItemSelect -A callback function that will fire on suggestion selection.
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
    onItemSelect,
    placeholder,
    children,
    fetchItems,
    ...rest
  } = props;
  //! Stores suggested items.
  const [items, setItems] = useState([]);
  //! Stores the term that user searched
  const [searchTerm, setSearchTerm] = useState('');
  //! If true, Shows Loading component, Otherwise, won't show it.
  const [isSearching, setIsSearching] = useState(false);
  //! If true, Shows a message to user to inform it that something went wrong.
  const [hasError, setHasError] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  const getSuggestions = () => {
    if (!fetchItems) return;
    fetchItems(debouncedSearchTerm)
      .then((response) => {
        console.log(response);
        setHasError(false);
        setTimeout(() => {
          setIsSearching(false);
        }, 500);
        if (response.length === 0) {
          setHasError(true);
          setItems([{ value: 'موردی یافت نشد!' }]);
        } else {
          setItems(response);
        }
      })
      .catch((err) => {
        setTimeout(() => {
          setIsSearching(false);
          setHasError(true);
          setItems([{ value: 'خطا در برقراری ارتباط' }]);
        }, 2000);
      });
  };

  //! This function will be called each time downshift sets its internal state.
  const handleReducer = (state, changes) => {
    if (!state.isOpen && state.selectedItem) {
      state.selectedItem.value = '';
      return changes;
    }

    return changes;
  };

  //! Called when the selected item changes.
  const handleChange = (selection) => {
    onItemSelect && selection && onItemSelect(selection);
  };

  //! Called when the user selects an item, regardless of the previous selected item.
  const handleSelection = (selectedItem, stateAndHelpers) => {
    if (!selectedItem) return;
    if (hasError) {
      stateAndHelpers.clearSelection();
      return;
    }
  };

  //! Downshift needs a string representation of stored items.
  const handleToString = (item) => (item ? item.value : '');

  //! Highlights searched term inside suggested items.
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
      //! Fetch new items on every amount of delay or mininum search term.
      getSuggestions();
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
        <Styled.AutoSuggestContainer
          {...rest}
          className="ColdBackgroundColor BorderRadius4">
          <Styled.InputElementWrapper
            {...getRootProps({
              refKey: 'inputwrapperRef',
            })}>
            <Input
              {...getInputProps({
                placeholder,
                className: 'BorderRadius4',
                style: { width: '100%' },
              })}>
              <DotsIcon size={15} />
            </Input>
          </Styled.InputElementWrapper>
          {isOpen && (
            <Styled.SuggestMenu
              {...getMenuProps({
                className:
                  'BorderRadius4 ColdBackgroundColor SurroundingShadow',
              })}
              {...getRootProps({ refKey: 'ulRef' })}
              items={items}>
              <Styled.ButtonsContainer className="ColdBackgroundColor">
                <Button type="primary">do sth</Button>
                <Button type="negative">do sth. else</Button>
              </Styled.ButtonsContainer>
              {isSearching && (
                <Styled.LoaderWrapper>
                  <LoadingIcon />
                </Styled.LoaderWrapper>
              )}
              <Styled.ListItemsContainer hasError={hasError} items={items}>
                {isOpen &&
                  !isSearching &&
                  inputValue &&
                  items.map((item, index) => {
                    return (
                      <Styled.ListItems
                        hasError={hasError}
                        {...getItemProps({
                          key: index,
                          className: `SoftBorder BorderRadius4 ${
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
          )}
        </Styled.AutoSuggestContainer>
      )}
    </Downshift>
  );
};

AutoSuggestInput.propTypes = {
  delay: PropTypes.number,
  searchAt: PropTypes.number,
  onItemSelect: PropTypes.func,
  getSuggestedItems: PropTypes.func,
  placeholder: PropTypes.string,
  endpoint: PropTypes.string,
  withMenu: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.node]),
};

AutoSuggestInput.defaultProps = {
  delay: 500,
  searchAt: 3,
  withMenu: true,
  placeholder: 'جستجو ...',
};

AutoSuggestInput.displayName = 'AutoSuggestInput';

export default AutoSuggestInput;
