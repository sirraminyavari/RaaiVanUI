/**
 * A DropDown with minimal animation in opening and closing time
 */
import ArrowDown from 'components/Icons/ArrowDown';
import React, { useState } from 'react';
import { ShakeAnimate } from 'views/Auth/elements/Animate.style';
import {
  Container,
  DomainsList,
  DropDownButton,
  ListItem,
  Rotater,
  Title,
  Error,
} from './AnimatedDropDownList.style';

/**
 *
 * @param {Array} list - Array of DropDown listItems.
 * @param {String} label - Label for DropDown.
 * @callback onSelectItem - Fires when the user clicks on an item of the DropDown List.
 */
const AnimatedDropDownList = ({
  list,
  label,
  onSelectItem,
  error,
  ...props
}) => {
  // If True, DropDown shows, if False, DropDown collapses
  const [dropedDown, setDropedDown] = useState(false);

  /**
   * Calls,By clicking on every 'ListItem'
   */
  const onClick = () => {
    setDropedDown(!dropedDown);
  };

  return (
    <Container>
      <ShakeAnimate isVisible={error}>
        <DropDownButton onClick={onClick} error={error}>
          <Rotater dropedDown={dropedDown}>
            <ArrowDown color={'#707070'} />
          </Rotater>
          <Title className="textarea">{label}</Title>
        </DropDownButton>
        <DomainsList dropedDown={dropedDown}>
          {list.map((x, index) => (
            <ListItem
              onClick={() => {
                // collapse dropdown
                setDropedDown(!dropedDown);
                // pass selected Item to its parent
                onSelectItem(x, index);
              }}
              key={index}
              dropedDown={dropedDown}>
              {x}
            </ListItem>
          ))}
        </DomainsList>
      </ShakeAnimate>
      <Error error={error}>{error}</Error>
    </Container>
  );
};
export default AnimatedDropDownList;
