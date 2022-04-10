import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { getUUID } from 'helpers/helpers';
import * as Styles from '../sharedItems/SharedStyles';
import styled from 'styled-components';
import { FLEX_CCC, FLEX_RCB, FLEX_RCS } from 'constant/StyledCommonCss';
import DragIcon from 'components/Icons/DragIcon/Drag';
import { CV_DISTANT, CV_GRAY } from 'constant/CssVariables';
import CloseIcon from 'components/Icons/CloseIcon/CloseIcon';
import Button from 'components/Buttons/Button';
import PlusIcon from 'components/Icons/PlusIcon/PlusIcon';
import produce from 'immer';

const SingleSelectMainSetting = ({ current, setFormObjects }) => {
  const { data } = current || {};
  const { Options } = data?.Info || {};

  const handleOptionTextChange = (value, index) => {
    setFormObjects(
      produce((d) => {
        const _current = d?.find((x) => x?.id === current?.id);
        _current.data.Info.Options[index] = value;
      })
    );
  };

  const handleAddNewOption = () => {
    setFormObjects(
      produce((d) => {
        const _current = d?.find((x) => x?.id === current?.id);
        _current.data.Info.Options.push('');
      })
    );
  };

  const handleSortOptions = ({ destination, source }) => {
    if (destination?.droppableId === source?.droppableId) {
      setFormObjects(
        produce((d) => {
          const _current = d?.find((x) => x?.id === current?.id);
          const _movingOption = _current.data.Info.Options[source?.index];
          _current.data.Info.Options.splice(source?.index, 1);
          _current.data.Info.Options.splice(
            destination?.index,
            0,
            _movingOption
          );
        })
      );
    }
  };

  const handleRemoveOption = (index) => {
    setFormObjects(
      produce((d) => {
        const _current = d?.find((x) => x?.id === current?.id);
        _current.data.Info.Options.splice(index, 1);
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
              {Options?.map((o, index) => (
                <Draggable key={index} draggableId={`item-${o}`} index={index}>
                  {(provided) => (
                    <DraggableOption
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <DragHandle {...provided.dragHandleProps}>
                        <DragIcon size={16} />
                      </DragHandle>
                      <OptionTextContainer>
                        <OptionTextInput
                          value={o}
                          onChange={(e) =>
                            handleOptionTextChange(e?.target.value, index)
                          }
                        />
                        <RemoveIconButton
                          onClick={() => handleRemoveOption(index)}
                        >
                          <CloseIcon outline={true} size={20} />
                        </RemoveIconButton>
                      </OptionTextContainer>
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

const OptionTextContainer = styled.div`
  height: 3rem;
  border: 0.0625rem solid ${CV_DISTANT};
  border-radius: 0.312rem;
  max-width: 34rem;
  width: 100%;
  ${FLEX_RCB};
  padding: 0 0.5rem;
`;
const OptionTextInput = styled.input.attrs({
  type: 'text',
})`
  width: 100%;
  border: none;
  outline: none;
  font-size: 0.875rem;
  color: ${CV_GRAY};
`;

const RemoveIconButton = styled.button`
  border: none;
  outline: none;
  cursor: pointer;
  height: 2rem;
  width: 2rem;
  color: ${CV_GRAY};
`;

const ButtonTitle = styled.span`
  margin: 0 0.5rem;
  user-select: none;
`;
export default SingleSelectMainSetting;
