import styled from 'styled-components';
import CaretIcon from 'components/Icons/CaretIcons/Caret';
import { CV_DISTANT, CV_GRAY, TCV_DEFAULT } from 'constant/CssVariables';
import PeopleOutlineIcon from 'components/Icons/PeopleOutlineIcon/PeopleOutlineIcon';

const LazyTreeNode = (props) => {
  // extract node event
  const { openNode, selectNode, loadMore, ...node } = props;
  const { isOpen } = props;
  const itemsList =
    props.items?.map((x) => {
      const { id } = x;
      return (
        <LazyTreeNode
          key={id}
          {...x}
          openNode={openNode}
          selectNode={selectNode}
          loadMore={loadMore}
        />
      );
    }) || [];

  return (
    <>
      <NodeTitleContainer>
        <NodeIconContainer>
          {props?.hasChildren && (
            <NodeIcon
              onClick={() => openNode(node)}
              dir="left"
              size={18}
              opened={isOpen ? 1 : 0}
            />
          )}
        </NodeIconContainer>

        <NodeTitle
          selectable={props.selectable}
          selected={props?.isSelected}
          onClick={() => selectNode(node)}>
          {props.selectable && <PeopleOutlineIcon size={14} />}
          {props.Name}
        </NodeTitle>
      </NodeTitleContainer>
      {props?.isOpen && (
        <>
          <ul> {itemsList} </ul>
          {props?.isLoading && <div>...loading </div>}

          {!props?.isLoading && props?.hasMore && (
            <button onClick={() => loadMore(node)}>load more</button>
          )}
        </>
      )}
    </>
  );
};

const NodeTitleContainer = styled.li`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 1.5rem;
  line-height: 1.5rem;
  margin: 0.7rem 0;
`;

const NodeTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 0.3rem;
  height: 1.5rem;
  line-height: 1.5rem;
  color: ${(props) => (props?.selected ? TCV_DEFAULT : CV_GRAY)};
  ${(props) => (props.selectable ? 'cursor: pointer' : '')};
  user-select: none;
`;

const NodeIconContainer = styled.div`
  height: 1.5rem;
  width: 1.5rem;
`;

const NodeIcon = styled(CaretIcon).attrs((props) => ({
  size: props.size,
  dir: props.dir,
}))`
  color: ${CV_DISTANT};
  cursor: pointer;
  transform: ${({ opened }) => (opened ? 'rotate(-90deg)' : 'rotate(0)')};
  transition: all 0.3s ease-out;
  margin-left: 0.5rem;
`;

export default LazyTreeNode;
