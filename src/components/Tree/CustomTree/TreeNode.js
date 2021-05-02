import CaretIcon from '../../Icons/CaretIcons/Caret';
import DragIcon from '../../Icons/DragIcon/Drag';
import { useState } from 'react';
import * as Styled from './Tree.styles';
import Tree from './Tree';

const TreeNode = (props) => {
  const { node, draggableProps, draggableRef, draggHandle } = props;
  const [childVisible, setChildVisiblity] = useState(false);

  const hasChild = node.children ? true : false;

  const handleVisibility = () => {
    setChildVisiblity((v) => !v);
  };

  return (
    <Styled.TreeNodeContainer
      {...draggableProps}
      style={{ ...draggableProps.style }}
      ref={draggableRef}>
      <Styled.LabelWrapper onClick={handleVisibility}>
        <Styled.IconWrapper {...draggHandle}>
          <DragIcon />
        </Styled.IconWrapper>
        {hasChild && (
          <Styled.IconWrapper isVisible={childVisible}>
            <CaretIcon dir="left" size={20} />
          </Styled.IconWrapper>
        )}

        <div>{node.label}</div>
      </Styled.LabelWrapper>

      {hasChild && childVisible && (
        <Styled.TreeContainer>
          <Tree data={node.children} droppableId={node.key} />
        </Styled.TreeContainer>
      )}
    </Styled.TreeNodeContainer>
  );
};

export default TreeNode;
