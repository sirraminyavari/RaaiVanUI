import React, { useImperativeHandle, useRef, forwardRef } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import TeamActive from './TeamActive';
import NewTeam from './NewTeam';
import ArchivedTeams from './ArchivedTeams';

// Drag sources and drop targets only interact
// if they have the same string type.
// You want to keep types in a separate file with
// the rest of your app's constants.
const Types = {
  TEAMS: 'teams',
};

/**
 * Specifies the drag source contract.
 * Only `beginDrag` function is required.
 */
const teamSource = {
  beginDrag(props) {
    // Return the data describing the dragged item
    let item = { ...props.team };
    item.index = props.index;
    return item;
  },

  endDrag(props, monitor) {
    //console.log(props);
    //console.log(monitor.getItem());
    //console.log(monitor.getDropResult());
  },
};

const teamTarget = {
  hover(props, monitor, component) {
    if (!component) {
      return null;
    }
    // node = HTML Div element from imperative API
    const node = component.getNode();
    if (!node) {
      return null;
    }

    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    //! Don't replace items with themselves.
    if (dragIndex === hoverIndex) {
      return;
    }

    //! Determine rectangle on screen.
    const hoverBoundingRect = node.getBoundingClientRect();

    // Scroll window if mouse near vertical edge(100px)

    // Horizontal Check --

    if (
      Math.abs(monitor.getClientOffset().x - hoverBoundingRect.left) >
      hoverBoundingRect.width / 1.3
    )
      return;

    // Vertical Check |

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex);
    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    //console.log(monitor.getItem());
    monitor.getItem().index = hoverIndex;
  },
};

/**
 * Specifies which props to inject into your component.
 */
const collect = (connect, monitor) => {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDragSource: connect.dragSource(),
    // You can ask the monitor about the current drag state:
    isDragging: monitor.isDragging(),
    getItem: monitor.getItem(),
  };
};

const DragItem = forwardRef(
  ({ team, getItem, connectDragSource, connectDropTarget }, ref) => {
    const elementRef = useRef(null);
    connectDragSource(elementRef);
    connectDropTarget(elementRef);
    let draggedId = null;
    if (getItem !== null) {
      draggedId = getItem.ApplicationID;
    }

    const isDragging = draggedId === team.ApplicationID;

    useImperativeHandle(ref, () => ({
      getNode: () => elementRef.current,
    }));
    if (team.ApplicationID === 'add-app') {
      return <NewTeam />;
    }
    if (team.ApplicationID === 'archived-apps') {
      return <ArchivedTeams team={team} />;
    }

    return <TeamActive ref={elementRef} team={team} isDragging={isDragging} />;
  }
);

// Export the wrapped version
export default DropTarget(Types.TEAMS, teamTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop(),
  itemType: monitor.getItemType(),
}))(DragSource(Types.TEAMS, teamSource, collect)(DragItem));
