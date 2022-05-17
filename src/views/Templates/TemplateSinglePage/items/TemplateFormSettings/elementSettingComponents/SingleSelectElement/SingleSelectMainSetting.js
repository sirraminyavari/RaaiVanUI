import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { getUUID } from 'helpers/helpers';
import * as Styles from '../sharedItems/SharedStyles';
import styled from 'styled-components';
import { FLEX_CCC, FLEX_RCB, FLEX_RCS } from 'constant/StyledCommonCss';
import DragIcon from 'components/Icons/DragIcon/Drag';
import Button from 'components/Buttons/Button';
import PlusIcon from 'components/Icons/PlusIcon/PlusIcon';
import produce from 'immer';
import SingleSelectInput from './SingleSelectInput';

const SingleSelectMainSetting = ({ current, setFormObjects }) => {
  const { data } = current || {};
  const { Items } = data?.Info || {};

  const handleOptionTextChange = (value, index) => {
    setFormObjects(
      produce((d) => {
        const _current = d?.find((x) => x?.id === current?.id);
        _current.data.Info.Items[index].text = value;
      })
    );
  };

  const handleOptionColorChange = (value, index) => {
    setFormObjects(
      produce((d) => {
        const _current = d?.find((x) => x?.id === current?.id);
        _current.data.Info.Items[index].color = value;
      })
    );
  };

  const handleOptionMaxChange = (value, index) => {
    setFormObjects(
      produce((d) => {
        const _current = d?.find((x) => x?.id === current?.id);
        _current.data.Info.Items[index].max = value;
      })
    );
  };

  const handleOptionMinChange = (value, index) => {
    setFormObjects(
      produce((d) => {
        const _current = d?.find((x) => x?.id === current?.id);
        _current.data.Info.Items[index].min = value;
      })
    );
  };

  const handleAddNewOption = () => {
    setFormObjects(
      produce((d) => {
        const _current = d?.find((x) => x?.id === current?.id);
        _current.data.Info.Items.push({
          text: '',
          color: '',
          min: '',
          max: '',
        });
      })
    );
  };

  const handleSortOptions = ({ destination, source }) => {
    if (destination?.droppableId === source?.droppableId) {
      setFormObjects(
        produce((d) => {
          const _current = d?.find((x) => x?.id === current?.id);
          const _movingOption = _current.data.Info.Items[source?.index];
          _current.data.Info.Items.splice(source?.index, 1);
          _current.data.Info.Items.splice(destination?.index, 0, _movingOption);
        })
      );
    }
  };

  const handleRemoveOption = (index) => {
    setFormObjects(
      produce((d) => {
        const _current = d?.find((x) => x?.id === current?.id);
        _current.data.Info.Items.splice(index, 1);
      })
    );
  };

  return (
    <Container>
      <DragDropContext onDragEnd={handleSortOptions}>
        <Droppable droppableId={getUUID()}>
          {(provided) => (
            <Styles.DroppableContainer
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {Items?.map((option, index) => (
                <Draggable
                  key={index}
                  draggableId={`item-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <DraggableOption
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <DragHandle {...provided.dragHandleProps}>
                        <DragIcon size={16} />
                      </DragHandle>
                      <SingleSelectInput
                        {...{
                          index,
                          option,
                          handleOptionTextChange,
                          handleOptionColorChange,
                          handleOptionMinChange,
                          handleOptionMaxChange,
                          handleRemoveOption,
                        }}
                      />
                    </DraggableOption>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Styles.DroppableContainer>
          )}
        </Droppable>

        <Button
          onClick={handleAddNewOption}
          style={{ width: 'fit-content', marginRight: '0.9rem' }}
          type="secondary-o"
        >
          <PlusIcon size={20} />
          <ButtonTitle>{'افزودن گزینه'}</ButtonTitle>
        </Button>
      </DragDropContext>
    </Container>
  );
};
const Container = styled.div`
  width: 100%;
`;
const DraggableOption = styled.div`
  ${FLEX_RCS};
  gap: 0.4rem;
  margin: 0.5rem 0;
`;
const DragHandle = styled.div`
  ${FLEX_CCC};
`;
const ButtonTitle = styled.span`
  margin: 0 0.5rem;
  user-select: none;
`;

export default SingleSelectMainSetting;
