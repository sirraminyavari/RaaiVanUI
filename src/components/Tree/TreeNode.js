import CaretIcon from '../Icons/CaretIcons/Caret';
import { useState } from 'react';
import * as Styled from './Tree.styles';
import Tree from './Tree';

const TreeNode = ({ node }) => {
  const [childVisible, setChildVisiblity] = useState(false);

  const hasChild = node.children ? true : false;

  const handleVisibility = () => {
    setChildVisiblity((v) => !v);
  };

  return (
    <Styled.TreeNodeContainer>
      <Styled.LabelWrapper onClick={handleVisibility}>
        {hasChild && (
          <Styled.CaretWrapper isVisible={childVisible}>
            <CaretIcon dir="left" size={20} />
          </Styled.CaretWrapper>
        )}

        <div>{node.label}</div>
      </Styled.LabelWrapper>

      {hasChild && childVisible && (
        <div>
          <Styled.TreeContainer>
            <Tree data={node.children} />
          </Styled.TreeContainer>
        </div>
      )}
    </Styled.TreeNodeContainer>
  );
};

export default TreeNode;
