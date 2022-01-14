import styled from 'styled-components';
import useWindowContext from 'hooks/useWindowContext';

const SHTemplateItem = ({ item, provided, depth, ...rest }) => {
  const { RV_RTL } = useWindowContext();

  return (
    <div
      style={{ direction: 'rtl' }}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}>
      <TreeItemContainer rtl={RV_RTL} depth={depth}>
        {item?.data?.title}
      </TreeItemContainer>
    </div>
  );
};
const TreeItemContainer = styled.div`
  ${({ rtl, depth }) =>
    rtl ? `margin-right: ${2 * depth}rem` : `margin-left: ${2 * depth}rem`};
  cursor: default;
`;
export default SHTemplateItem;
