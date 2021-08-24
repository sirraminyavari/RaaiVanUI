import getIcon from 'utils/treeUtils/getItemIcon';

const TemplateItem = ({ itemProps }) => {
  const { item, onExpand, onCollapse, provided, depth } = itemProps;
  return (
    <div
      style={{ margin: '1rem', border: '1px solid #333' }}
      ref={provided.innerRef}>
      {item?.isCategory && getIcon(item, onExpand, onCollapse)}
      {item?.data?.title}
    </div>
  );
};

export default TemplateItem;
