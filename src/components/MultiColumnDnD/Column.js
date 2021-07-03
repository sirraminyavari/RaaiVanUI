import Item from './Item';
import { Droppable } from 'react-beautiful-dnd';
import * as Styled from './MultiColumnDnD.styles';

const Column = ({ col: { list, id } }) => {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <Styled.Column>
          <h2>{id}</h2>
          <Styled.List {...provided.droppableProps} ref={provided.innerRef}>
            {list.map((text, index) => (
              <Item key={text} text={text} index={index} />
            ))}
            {provided.placeholder}
          </Styled.List>
        </Styled.Column>
      )}
    </Droppable>
  );
};

export default Column;
