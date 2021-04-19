import * as Styled from './Tree.styles';
import TreeNode from './TreeNode';

const Tree = ({ data = [] }) => {
  return (
    <div>
      <Styled.TreeContainer>
        {data.map((tree) => (
          <TreeNode node={tree} key={tree.key} />
        ))}
      </Styled.TreeContainer>
    </div>
  );
};

export default Tree;
