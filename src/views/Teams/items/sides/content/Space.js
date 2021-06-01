import { useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import * as Styled from '../../../Teams.styles';
import ActiveTeam from './TeamActive';
// import InactiveTeam from './TeamInactive';
import NewTeam from './NewTeam';
import SpaceHeader from './SpcaeHeader';
import { createSelector } from 'reselect';
import { WindowContext } from 'context/WindowProvider';
import { ApplicationsSlice } from 'store/reducers/applicationsReducer';

const { setApplications } = ApplicationsSlice.actions;

const selectApplications = createSelector(
  (state) => state.applications,
  (applications) => applications.applications
);

const WorkSpace = ({ space }) => {
  const dispatch = useDispatch();
  const teams = useSelector(selectApplications);
  const { RVGlobal } = useContext(WindowContext);
  const { IsSystemAdmin } = RVGlobal;

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const reorderedTeams = reorder(
      teams,
      result.source.index,
      result.destination.index
    );

    dispatch(setApplications(reorderedTeams));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Styled.SpaceConatiner>
        <SpaceHeader space={space} />
        <Droppable droppableId={space.id} type="space">
          {(provided, snapshot) => (
            <Styled.TeamListConatiner
              {...provided.droppableProps}
              ref={provided.innerRef}>
              {teams.map((team, key) => {
                return (
                  <Draggable
                    key={team.ApplicationID}
                    draggableId={team.ApplicationID}
                    index={key}>
                    {(provided, snapshot) => {
                      let isDragging = snapshot.isDragging;
                      let dragHandleProps = provided.dragHandleProps;
                      return (
                        <div
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                          style={{ ...provided.draggableProps.style }}>
                          <ActiveTeam
                            key={key}
                            team={team}
                            dragHandle={dragHandleProps}
                          />
                        </div>
                      );
                    }}
                  </Draggable>
                );
              })}
              {IsSystemAdmin && <NewTeam />}
              {provided.placeholder}
            </Styled.TeamListConatiner>
          )}
        </Droppable>
      </Styled.SpaceConatiner>
    </DragDropContext>
  );
};

export default WorkSpace;
