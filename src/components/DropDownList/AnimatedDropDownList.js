/**
 * A DropDown with minimal animation in opening and closing time.
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowIcon,
  Container,
  ItemList,
  DropDownButton,
  Label,
  Maintainer,
  Rotater,
  Divider,
} from './AnimatedDropDownList.style';
import DropDownItem from './DropDownItem';
import PropTypes from 'prop-types';

/**
 *
 * @param {object[]} data - Array of DropDown listItems.
 * [{
 *  icon: Component,
 *  label: String,
 *  value: any,
 *  color: hex|rgb,
 * }]
 * @param  {object} defaultValue - The default value for showing on the dropdown, when still nothing is selected.
 * {
 *  icon: Component,
 *  label: String,
 *  value: any,
 *  color: hex|rgb,
 * }
 * @param {Boolean} hiddenSelectedItem - If True, removes selected item from  the drop-down list.
 * @param {object} customStyle - For applying the style in each segment.
 * {
 *  button: CSSProperties,
 *  label: CSSProperties,
 *  item: CSSProperties,
 *  container: CSSProperties,
 *  itemContainer: CSSProperties,
 * }
 * @callback onSelectItem - Fires when the user clicks on an item of the DropDown List.
 */
const AnimatedDropDownList = ({
  data,
  onSelectItem,
  defaultValue,
  customStyle = {
    button: null,
    label: null,
    item: null,
    container: null,
    itemContainer: null,
    arrowIconColor: null,
  },
  customClass = {
    buttonClass: null,
    labelClass: null,
    itemClass: null,
    containerClass: null,
    itemContainerClass: null,
    arrowIconColorClass: null,
  },
  hiddenSelectedItem,
  onClickLabel,
  onDropDownOpen,
  introMode,
}) => {
  const { button, label, item, container, itemContainer } = customStyle;
  const {
    buttonClass,
    labelClass,
    itemClass,
    containerClass,
    itemContainerClass,
    arrowIconColorClass,
    dividerClass = 'rv-bg-color-white',
  } = customClass;

  // If True, DropDown shows, if False, DropDown collapses
  const [dropedDown, setDropedDown] = useState(false);

  const buttonRef = useRef();

  useEffect(() => {
    setDropedDown(introMode);
  }, [introMode]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        buttonRef?.current &&
        !buttonRef?.current?.contains(event?.target) &&
        !introMode
      ) {
        // onClick();
        onDropDownOpen(false);
        setDropedDown(false);
      }
    }

    // Bind the event listener
    document?.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document?.removeEventListener('mousedown', handleClickOutside);
    };
  }, [buttonRef]);

  /**
   * Close/Open drop-down
   */
  const onClick = () => {
    setDropedDown(!dropedDown);
    onDropDownOpen(!dropedDown);
  };

  /**
   * Calls,By clicking on every 'ListItem'
   * Passes selected Item to the up!
   */
  const onClickItem = (item, index) => {
    onSelectItem(item);
    setDropedDown(!dropedDown);
  };
  /**
   *
   * @returns Items in the drop-down list
   */
  const renderList = () => {
    const list = hiddenSelectedItem
      ? data?.filter((raw) => raw?.value !== defaultValue?.value)
      : data;
    return (
      <ItemList
        id={'list'}
        style={{ ...itemContainer }}
        $dropedDown={dropedDown}
        className={itemContainerClass}>
        {list?.map((x, index) => (
          <DropDownItem
            onSelectItem={() => onClickItem(x, index)}
            item={x}
            key={index}
            itemStyle={item}
            className={itemClass}
            $dropedDown={dropedDown}
          />
        ))}
      </ItemList>
    );
  };

  return (
    <Container ref={buttonRef}>
      <DropDownButton className={containerClass} style={{ ...container }}>
        <Rotater
          $dropedDown={dropedDown}
          onClick={onClick}
          style={{ ...button }}
          className={buttonClass}>
          <ArrowIcon
            $dropedDown={dropedDown}
            color={customStyle?.arrowIconColor}
            className={arrowIconColorClass}
          />
        </Rotater>
        <Divider className={dividerClass} />
        <Maintainer
          className={labelClass}
          onClick={onClickLabel}
          style={{ ...label }}>
          {defaultValue?.icon}
          <Label color={defaultValue.color}>{defaultValue?.label}</Label>
        </Maintainer>
      </DropDownButton>
      {renderList()}
    </Container>
  );
};

AnimatedDropDownList.propTypes = {
  data: PropTypes.array.isRequired,
  onSelectItem: PropTypes.func.isRequired,
  defaultValue: PropTypes.object.isRequired,
  hiddenSelectedItem: PropTypes.bool,
  customStyle: PropTypes.object,
};
export default AnimatedDropDownList;
