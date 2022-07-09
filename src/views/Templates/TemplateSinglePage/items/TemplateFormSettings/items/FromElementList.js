import list, { flatFormElements } from './FormElements';
import { useMemo, useState } from 'react';
import * as Styles from '../TemplateFormSettingsStyles';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import SearchIcon from 'components/Icons/SearchIcon/Search';
import ScrollBarProvider from 'components/ScrollBarProvider/ScrollBarProvider';

const FormElementList = () => {
  const [searchText, setSearchText] = useState('');
  const { RVDic, RV_RTL } = window;

  const elements = useMemo(() => {
    if (!!searchText) {
      const items = flatFormElements()?.filter(({ title }) =>
        title?.includes(searchText)
      );

      return (
        <Droppable droppableId={`SEARCHED_ELEMENTS_ICON`} isDropDisabled={true}>
          {(provided, snapshot) => (
            <Styles.FormElementList
              {...provided.droppableProps}
              ref={provided.innerRef}
              isDraggingOver={snapshot.isDraggingOver}
            >
              <Styles.FormElementListWrapper height={(items?.length - 1) * 6.4}>
                {items?.map((l, index) => {
                  const { title, id, icon, type } = l;
                  return (
                    <Draggable
                      key={id}
                      draggableId={`${id}-${type}`}
                      index={index}
                    >
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
                              <Styles.IconWrapper>{icon}</Styles.IconWrapper>
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
      );
    }
    return list()?.map((x) => {
      const { id, title, items, type } = x;
      return (
        <Styles.FromElementGroupLabel key={id} $rtl={RV_RTL}>
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
                  {items?.map((l, index) => {
                    const { title, id, icon, type } = l;
                    return (
                      <Draggable
                        key={id}
                        draggableId={`${id}-${type}`}
                        index={index}
                      >
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
                                <Styles.IconWrapper>{icon}</Styles.IconWrapper>
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
    });
  }, [searchText]);

  return (
    <Styles.FormList>
      <Styles.SearchFieldContainer>
        <input
          type="text"
          placeholder={RVDic?.Search}
          value={searchText}
          onChange={(e) => setSearchText(e?.target?.value)}
        />

        <SearchIcon size={18} />
      </Styles.SearchFieldContainer>

      <Styles.ListWrapper>
        <ScrollBarProvider direction={RV_RTL ? 'right' : 'left'}>
          {elements}
        </ScrollBarProvider>
      </Styles.ListWrapper>
    </Styles.FormList>
  );
};
export default FormElementList;
