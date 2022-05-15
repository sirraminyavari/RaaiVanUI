import list from './FormElements';
import { useMemo } from 'react';
import * as Styles from '../TemplateFormSettingsStyles';
import { Draggable, Droppable } from 'react-beautiful-dnd';

const FormElementList = () => {
  const _list = useMemo(() => list(), []);
  return (
    <Styles.FormElementList>
      {_list.map((x) => {
        const { id, title, items } = x;
        return (
          <Styles.FromElementGroupLabel key={id}>
            <Styles.FromElementGroupLabel>{title}</Styles.FromElementGroupLabel>
            <Droppable droppableId={`${id}`} isDropDisabled={true}>
              {(provided, snapshot) => (
                <Styles.FormElementList
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  <Styles.FormElementListWrapper
                    height={(items?.length - 1) * 6.4}
                  >
                    {[...items].map((l, index) => {
                      const { title, id, icon } = l;
                      return (
                        <Draggable key={id} draggableId={`${id}`} index={index}>
                          {(provided, snapshot) => (
                            <>
                              <Styles.FormElementItem
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                isDragging={snapshot.isDragging}
                              >
                                <Styles.IconWrapper>{icon}</Styles.IconWrapper>
                                {title}
                              </Styles.FormElementItem>
                              {snapshot.isDragging && (
                                <Styles.Clone>
                                  <Styles.IconWrapper>
                                    {icon}
                                  </Styles.IconWrapper>
                                  {title}
                                </Styles.Clone>
                              )}
                            </>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </Styles.FormElementListWrapper>
                </Styles.FormElementList>
              )}
            </Droppable>
          </Styles.FromElementGroupLabel>
        );
      })}
    </Styles.FormElementList>
  );
};
export default FormElementList;
